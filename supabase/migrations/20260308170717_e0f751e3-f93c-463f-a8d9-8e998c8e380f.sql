
-- Add currency column to quotes
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD';

-- Add currency column to invoices  
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD';

-- Add default_currency to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_currency text NOT NULL DEFAULT 'USD';
