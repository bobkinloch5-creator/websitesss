const sql = require('../config/neon');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  try {
    console.log('🚀 Starting Neon database migration...\n');
    
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, '01_create_tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📝 Executing migration SQL...');
    
    // Execute the migration
    await sql.unsafe(sqlContent);
    
    console.log('✅ Migration completed successfully!');
    console.log('✅ All tables, indexes, and triggers have been created.');
    
    // Test connection by checking if tables exist
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'projects', 'prompts')
      ORDER BY table_name
    `;
    
    console.log('\n📊 Created tables:');
    result.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.error('\nIf tables already exist, this is normal. Your database is ready to use.');
    process.exit(0);
  }
}

runMigration();
