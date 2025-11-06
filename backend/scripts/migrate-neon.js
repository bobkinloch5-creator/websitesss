const postgres = require('postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create connection to Neon
// Remove quotes from DATABASE_URL if present
const dbUrl = process.env.DATABASE_URL.replace(/^['"]|['"]$/g, '');

const sql = postgres(dbUrl, { 
  ssl: 'require',
  max: 1,
  connection: {
    application_name: 'hideoutbot_migrations'
  }
});

async function runMigrations() {
  try {
    console.log('🔄 Connecting to Neon database...');
    
    // Test connection
    const result = await sql`SELECT NOW()`;
    console.log('✅ Connected to Neon!', result[0].now);
    
    // Read migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    
    console.log(`\n📂 Found ${migrationFiles.length} migration files:\n`);
    
    for (const file of migrationFiles) {
      console.log(`▶️  Running: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf-8');
      
      // Split by semicolon and execute each statement
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        try {
          await sql.unsafe(statement);
        } catch (err) {
          // Ignore "already exists" errors
          if (!err.message.includes('already exists')) {
            throw err;
          }
          console.log(`   ⚠️  Skipped (already exists)`);
        }
      }
      
      console.log(`   ✅ Completed: ${file}\n`);
    }
    
    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();
