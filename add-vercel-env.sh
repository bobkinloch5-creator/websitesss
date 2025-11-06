#!/bin/bash

echo "Adding all environment variables to Vercel..."

# Supabase
echo "postgres://postgres.ietfjriwlsvdizjwttkb:383r6JWf66ex02em@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require" | vercel env add DATABASE_URL production --force
echo "https://ietfjriwlsvdizjwttkb.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production --force
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGZqcml3bHN2ZGl6and0dGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODM2NDMsImV4cCI6MjA3Nzc1OTY0M30.XMNDH7jWbVmQeEyKLOfr98B9XIPiqzuE1LmAKrXMTxY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --force
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGZqcml3bHN2ZGl6and0dGtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE4MzY0MywiZXhwIjoyMDc3NzU5NjQzfQ.lmD6ClIu2uouLQh3q9kuUFF4CECcbUbCmTZ_ZOE4Rok" | vercel env add SUPABASE_SERVICE_ROLE_KEY production --force

# JWT & Auth
echo "7296d302dd9eec864791771b37a8394a103886d82c0834b2e39827edf325e256" | vercel env add JWT_SECRET production --force

# URLs
echo "https://www.hideoutbot.lol" | vercel env add FRONTEND_URL production --force
echo "https://www.hideoutbot.lol" | vercel env add NEXT_PUBLIC_BASE_URL production --force
echo "https://www.hideoutbot.lol" | vercel env add NEXT_PUBLIC_SITE_URL production --force

# PayPal
echo "AfL1OnhYTJxvyBEaXeeCQXrogrSsPbDBWgP_T5HTe1I300Q9VB4Zz6G8tm641LJDhZlrqlShcXgmrhrt" | vercel env add PAYPAL_CLIENT_ID production --force
echo "Aau4HHyCl8sC-d7kcCB_rvTneBJU3ev2OHIBr8t-pYU761QbOqbsol9vfBCOUsteRQtz2uHUKTzuMvyk" | vercel env add PAYPAL_CLIENT_SECRET production --force
echo "sandbox" | vercel env add PAYPAL_MODE production --force
echo "0.20" | vercel env add PAYPAL_PRICE_PER_PROMPT production --force
echo "0.20" | vercel env add NEXT_PUBLIC_PRICE_PER_PROMPT production --force

# AWS Bedrock
echo "AKIAVOMAUFW3F5H6KDNM" | vercel env add AWS_ACCESS_KEY_ID production --force
echo "b8kTDxp2RP7FU61uwK6mYLBsm0+wjaFlT6hQQdPl" | vercel env add AWS_SECRET_ACCESS_KEY production --force
echo "us-east-1" | vercel env add AWS_REGION production --force
echo "us-east-1" | vercel env add AWS_BEDROCK_REGION production --force
echo "https://bedrock-proxy.us-east-1.amazonaws.com" | vercel env add AWS_BEDROCK_PROXY_URL production --force
echo "ABSKQmVkcm9ja0FQSUtleS14OW54LWF0LTM3NDQ2ODc4MzU0MjpBTlo0eURzWXhKcmlOM3lDa0dDVkNSYWFtbUpPdWQ4YU8rMlhqUlJ1dGJ2dG1FUUV1c0JpcnAxcFpqND0=" | vercel env add AWS_BEARER_TOKEN_BEDROCK production --force

# OpenAI
echo "EAATU5fH0yNcBPt5d4prNlyUJHw6XOJZCrIGfBuuKGcJmKIre7KJe3CYbuQ2ttubAfqkzbfr6OgOeZCy04rBYClQqHXFG1vioZAWOC6jWcOpHW9QkX7SZAS2eTGBP86FiVDGzcbfu0zayKmRv48EVmg0teBfnjkjuzhHPZAbNd1vL1ZA5IebVRqNaKF3yDPTgt3kSLS2ZA9byiRJwM5dJZCtYQLO7FhEQKynjHPjEJkFac8VkXbZA76tH8B3QkUWfzIzvmKvLKHguggyE8JWcZD" | vercel env add OPENAI_API_KEY production --force

# Admin emails
echo "kinlchdavid@gmail.com" | vercel env add OWNER_EMAIL production --force
echo "Brotmandavid24@gmail.com" | vercel env add ADMIN_EMAIL production --force

# App settings
echo "production" | vercel env add NODE_ENV production --force
echo "5000" | vercel env add PORT production --force

echo "✅ All environment variables added!"
