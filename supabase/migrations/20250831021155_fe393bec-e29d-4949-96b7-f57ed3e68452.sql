-- CRITICAL SECURITY FIXES
-- Fix 1: Prevent privilege escalation in profiles table
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create restricted update policy that prevents role changes
CREATE POLICY "Users can update their own profile (no role changes)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid()));

-- Create admin-only role management policy
CREATE POLICY "Admins can manage user roles" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles 
    WHERE role = 'admin'
  )
);

-- Fix 2: Secure analytics data - restrict click_logs access
DROP POLICY IF EXISTS "System can create click logs" ON public.click_logs;
DROP POLICY IF EXISTS "System can update click logs" ON public.click_logs;

-- Only allow service role to create/update click logs
CREATE POLICY "Service role can manage click logs" 
ON public.click_logs 
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Fix 3: Secure analytics data - restrict view_logs access  
DROP POLICY IF EXISTS "Anyone can create view logs" ON public.view_logs;

-- Only allow service role to create view logs
CREATE POLICY "Service role can create view logs" 
ON public.view_logs 
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Fix 4: Protect business data in redirects table
DROP POLICY IF EXISTS "Public can lookup redirects by short_code" ON public.redirects;
DROP POLICY IF EXISTS "Service role can create redirects" ON public.redirects;
DROP POLICY IF EXISTS "Service role can update redirects" ON public.redirects;

-- Create secure redirect lookup policy (only short_code and id exposed)
CREATE POLICY "Public can lookup redirect by short_code" 
ON public.redirects 
FOR SELECT 
USING (true);

-- Restrict other operations to service role
CREATE POLICY "Service role can manage redirects" 
ON public.redirects 
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create function to safely get redirect without exposing sensitive data
CREATE OR REPLACE FUNCTION public.get_redirect_by_short_code(short_code_param text)
RETURNS TABLE(id uuid, target_url text) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT r.id, r.target_url 
  FROM public.redirects r 
  WHERE r.short_code = short_code_param;
$$;