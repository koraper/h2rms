#!/usr/bin/env node

/**
 * Test Supabase Connection
 * This script tests the database connection and verifies the schema
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  // Test basic connection
  console.log('1. Testing basic connection...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('📝 Make sure you have run the schema.sql in Supabase SQL Editor');
      return;
    }

    console.log('✅ Basic connection successful');
  } catch (err) {
    console.log('❌ Connection error:', err.message);
    return;
  }

  // Test admin connection
  console.log('2. Testing admin connection...');
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data: departments, error: deptError } = await supabaseAdmin
      .from('departments')
      .select('*')
      .limit(5);

    if (deptError) {
      console.log('❌ Admin connection failed:', deptError.message);
    } else {
      console.log('✅ Admin connection successful');
      console.log(`📊 Found ${departments.length} departments`);
    }
  } catch (err) {
    console.log('❌ Admin connection error:', err.message);
  }

  // Test table structure
  console.log('3. Testing table structure...');
  const tables = [
    'profiles',
    'departments',
    'attendance',
    'leave_requests',
    'locations',
    'documents'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`);
      } else {
        console.log(`✅ Table '${table}': OK`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}': ${err.message}`);
    }
  }

  console.log('\n🎉 Connection test completed!');
  console.log('\nNext steps:');
  console.log('1. If any tables failed, run the schema.sql in Supabase SQL Editor');
  console.log('2. Run: npm run dev');
  console.log('3. Open: http://localhost:3000');
}

testConnection().catch(console.error);