import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ietfjriwlsvdizjwttkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGZqcml3bHN2ZGl6and0dGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODM2NDMsImV4cCI6MjA3Nzc1OTY0M30.XMNDH7jWbVmQeEyKLOfr98B9XIPiqzuE1LmAKrXMTxY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
