
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en',
ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#6C47FF',
ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#EC4899',
ADD COLUMN IF NOT EXISTS footer_text text DEFAULT 'Thank you for your business!',
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS default_quote_template text NOT NULL DEFAULT 'minimal',
ADD COLUMN IF NOT EXISTS default_invoice_template text NOT NULL DEFAULT 'minimal',
ADD COLUMN IF NOT EXISTS company_address text,
ADD COLUMN IF NOT EXISTS company_phone text,
ADD COLUMN IF NOT EXISTS company_email text,
ADD COLUMN IF NOT EXISTS company_website text,
ADD COLUMN IF NOT EXISTS org_number text;
