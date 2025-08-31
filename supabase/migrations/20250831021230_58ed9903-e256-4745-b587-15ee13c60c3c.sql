-- Fix remaining security warning: Function Search Path Mutable
-- Update existing functions to have immutable search_path

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'  -- Fix: Set immutable search_path
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email), 'visitor');
  RETURN new;
END;
$function$;

-- Update the update_updated_at_column function  
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- Fix: Set immutable search_path
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update the fn_build_affiliate_url function
CREATE OR REPLACE FUNCTION public.fn_build_affiliate_url(base_url text, affiliate_code text, product_title text DEFAULT ''::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- Fix: Set immutable search_path
AS $function$
BEGIN
  RETURN base_url || '?tag=' || affiliate_code || '&utm_source=portal&utm_medium=affiliate&utm_campaign=' || COALESCE(product_title, 'coupon');
END;
$function$;

-- Update the current_user_can_see_affiliate_data function
CREATE OR REPLACE FUNCTION public.current_user_can_see_affiliate_data()
RETURNS boolean
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = 'public'  -- Fix: Set immutable search_path  
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = ANY (ARRAY['admin'::text, 'editor'::text])
  );
END;
$function$;

-- Update the get_redirect_by_short_code function
CREATE OR REPLACE FUNCTION public.get_redirect_by_short_code(short_code_param text)
RETURNS TABLE(id uuid, target_url text) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'  -- Fix: Set immutable search_path
AS $function$
  SELECT r.id, r.target_url 
  FROM public.redirects r 
  WHERE r.short_code = short_code_param;
$function$;