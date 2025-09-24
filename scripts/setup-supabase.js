#!/usr/bin/env node

/**
 * Supabase Setup Helper Script
 * This script helps you configure your Supabase project for H2RMS
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🚀 H2RMS Supabase Setup Helper\n');

  console.log('Please follow these steps to get your Supabase credentials:\n');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your h2rms-database project');
  console.log('3. Go to Settings > API');
  console.log('4. Copy the required values\n');

  try {
    const projectUrl = await question('Enter your Supabase Project URL: ');
    const anonKey = await question('Enter your Supabase anon/public key: ');
    const serviceRoleKey = await question('Enter your Supabase service_role key: ');

    // Validate inputs
    if (!projectUrl.includes('supabase.co')) {
      throw new Error('Invalid Supabase URL format');
    }

    if (anonKey.length < 100) {
      throw new Error('Anon key seems too short');
    }

    if (serviceRoleKey.length < 100) {
      throw new Error('Service role key seems too short');
    }

    // Read current .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Replace the placeholder values
    envContent = envContent.replace(
      'NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co',
      `NEXT_PUBLIC_SUPABASE_URL=${projectUrl}`
    );

    envContent = envContent.replace(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here',
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`
    );

    envContent = envContent.replace(
      'SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here',
      `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`
    );

    // Write back to file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Successfully updated .env.local with your Supabase credentials!');
    console.log('\nNext steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm run dev');
    console.log('3. Set up your database schema using the setup script');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
