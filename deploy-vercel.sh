#!/bin/bash

echo "🚀 Setting up Vercel Environment Variables for Hideout Bot"
echo "==========================================================="

# Add all environment variables to Vercel
echo "📝 Adding Supabase variables..."
vercel env add POSTGRES_URL production < <(echo "postgres://postgres.ietfjriwlsvdizjwttkb:383r6JWf66ex02em@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x")
vercel env add POSTGRES_PRISMA_URL production < <(echo "postgres://postgres.ietfjriwlsvdizjwttkb:383r6JWf66ex02em@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true")
vercel env add DATABASE_URL production < <(echo "postgres://postgres.ietfjriwlsvdizjwttkb:383r6JWf66ex02em@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require")
vercel env add NEXT_PUBLIC_SUPABASE_URL production < <(echo "https://ietfjriwlsvdizjwttkb.supabase.co")
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production < <(echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGZqcml3bHN2ZGl6and0dGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODM2NDMsImV4cCI6MjA3Nzc1OTY0M30.XMNDH7jWbVmQeEyKLOfr98B9XIPiqzuE1LmAKrXMTxY")
vercel env add SUPABASE_SERVICE_ROLE_KEY production < <(echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGZqcml3bHN2ZGl6and0dGtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE4MzY0MywiZXhwIjoyMDc3NzU5NjQzfQ.lmD6ClIu2uouLQh3q9kuUFF4CECcbUbCmTZ_ZOE4Rok")
vercel env add STORAGE_SUPABASE_JWT_SECRET production < <(echo "4/9A5Jp+t6S7LF8TNQtYB6JIkRDF8QWipiM1gNbAz8Z14mCbCy9NZkbK3OR+6NUwxQ7RbhTFDHrAVGN6nTFzVA==")

echo "📝 Adding AI API keys..."
vercel env add OPENAI_API_KEY production < <(echo "EAATU5fH0yNcBPt5d4prNlyUJHw6XOJZCrIGfBuuKGcJmKIre7KJe3CYbuQ2ttubAfqkzbfr6OgOeZCy04rBYClQqHXFG1vioZAWOC6jWcOpHW9QkX7SZAS2eTGBP86FiVDGzcbfu0zayKmRv48EVmg0teBfnjkjuzhHPZAbNd1vL1ZA5IebVRqNaKF3yDPTgt3kSLS2ZA9byiRJwM5dJZCtYQLO7FhEQKynjHPjEJkFac8VkXbZA76tH8B3QkUWfzIzvmKvLKHguggyE8JWcZD")

echo "📝 Adding PayPal configuration..."
vercel env add PAYPAL_CLIENT_ID production < <(echo "AfL1OnhYTJxvyBEaXeeCQXrogrSsPbDBWgP_T5HTe1I300Q9VB4Zz6G8tm641LJDhZlrqlShcXgmrhrt")
vercel env add PAYPAL_CLIENT_SECRET production < <(echo "Aau4HHyCl8sC-d7kcCB_rvTneBJU3ev2OHIBr8t-pYU761QbOqbsol9vfBCOUsteRQtz2uHUKTzuMvyk")

echo "📝 Adding JWT Secret..."
vercel env add JWT_SECRET production < <(echo "7296d302dd9eec864791771b37a8394a103886d82c0834b2e39827edf325e256")

echo "📝 Adding AWS Bedrock configuration..."
vercel env add AWS_ACCESS_KEY_ID production < <(echo "AKIAVOMAUFW3F5H6KDNM")
vercel env add AWS_SECRET_ACCESS_KEY production < <(echo "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")
vercel env add AWS_BEARER_TOKEN_BEDROCK production < <(echo "ABSKQmVkcm9ja0FQSUtleS14OW54LWF0LTM3NDQ2ODc4MzU0MjpBTlo0eURzWXhKcmlOM3lDa0dDVkNSYWFtbUpPdWQ4YU8rMlhqUlJ1dGJ2dG1FUUV1c0JpcnAxcFpqND0=")

echo "✅ Environment variables added to Vercel!"
echo ""
echo "📦 Now deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
