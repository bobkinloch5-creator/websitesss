const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Starting Supabase migration...\n');
    
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, '01_create_tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📝 Migration SQL loaded');
    console.log('⚠️  Please run the following SQL in your Supabase SQL Editor:');
    console.log('📍 Go to: https://supabase.com/dashboard/project/ietfjriwlsvdizjwttkb/sql/new\n');
    console.log('════════════════════════════════════════════════════════');
    console.log(sqlContent);
    console.log('════════════════════════════════════════════════════════\n');
    
    // Test connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('⚠️  Tables do not exist yet. Please run the SQL above in Supabase SQL Editor first.');
    } else if (error && error.code !== 'PGRST116') {
      console.error('❌ Error testing connection:', error);
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('✅ Tables appear to be created successfully!');
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

runMigration();
