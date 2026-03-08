
-- Create a sequence table for atomic document numbering per user
CREATE TABLE public.document_sequences (
  user_id uuid NOT NULL,
  doc_type text NOT NULL CHECK (doc_type IN ('quote', 'invoice')),
  last_number integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, doc_type)
);

ALTER TABLE public.document_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sequences"
  ON public.document_sequences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to generate next document number atomically
CREATE OR REPLACE FUNCTION public.generate_document_number(p_user_id uuid, p_doc_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next integer;
  v_prefix text;
BEGIN
  -- Determine prefix
  IF p_doc_type = 'quote' THEN
    v_prefix := 'QC-Q-';
  ELSIF p_doc_type = 'invoice' THEN
    v_prefix := 'QC-I-';
  ELSE
    RAISE EXCEPTION 'Invalid doc_type: %', p_doc_type;
  END IF;

  -- Upsert and atomically increment
  INSERT INTO public.document_sequences (user_id, doc_type, last_number)
  VALUES (p_user_id, p_doc_type, 1)
  ON CONFLICT (user_id, doc_type)
  DO UPDATE SET last_number = document_sequences.last_number + 1
  RETURNING last_number INTO v_next;

  RETURN v_prefix || lpad(v_next::text, 4, '0');
END;
$$;
