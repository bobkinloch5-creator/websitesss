const postgres = require('postgres');

// Create Neon Postgres connection
const sql = postgres(process.env.DATABASE_URL, { 
  ssl: 'require',  // Neon requires SSL
  max: 10,         // Maximum number of connections
  idle_timeout: 20,
  connect_timeout: 10
});

// Test connection
sql`SELECT NOW()`.then(() => {
  console.log('✅ Connected to Neon Postgres database');
}).catch(err => {
  console.error('❌ Failed to connect to Neon Postgres:', err.message);
});

module.exports = sql;
