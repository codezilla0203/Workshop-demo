/**
 * Simple API Testing Script
 * Run with: node scripts/test-api.js
 * 
 * This script tests all API endpoints to ensure they work correctly
 */

const BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let authToken = '';
let testUserId = '';
let adminToken = '';

// Helper function to make API requests
async function apiRequest(method, endpoint, body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (token) {
    options.headers['Cookie'] = `token=${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, data: { error: error.message }, ok: false };
  }
}

// Test functions
async function testSignup() {
  console.log('\n📝 Testing User Signup...');
  const result = await apiRequest('POST', '/api/auth/signup', {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'Test1234',
  });

  if (result.ok && result.data.success) {
    authToken = result.data.data.token;
    testUserId = result.data.data.user.id;
    console.log(`${colors.green}✅ Signup successful${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.red}❌ Signup failed: ${result.data.error}${colors.reset}`);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔐 Testing User Login...');
  const result = await apiRequest('POST', '/api/auth/login', {
    email: 'test@example.com',
    password: 'Test1234',
  });

  if (result.ok && result.data.success) {
    console.log(`${colors.green}✅ Login successful${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.yellow}⚠️  Login test skipped (user may not exist)${colors.reset}`);
    return false;
  }
}

async function testGetCurrentUser() {
  console.log('\n👤 Testing Get Current User...');
  if (!authToken) {
    console.log(`${colors.yellow}⚠️  Skipped (no auth token)${colors.reset}`);
    return false;
  }

  const result = await apiRequest('GET', '/api/auth/me', null, authToken);
  if (result.ok && result.data.success) {
    console.log(`${colors.green}✅ Get current user successful${colors.reset}`);
    console.log(`   User: ${result.data.data.user.name} (${result.data.data.user.email})`);
    return true;
  } else {
    console.log(`${colors.red}❌ Get current user failed: ${result.data.error}${colors.reset}`);
    return false;
  }
}

async function testListUsers() {
  console.log('\n📋 Testing List Users (Admin)...');
  if (!adminToken) {
    console.log(`${colors.yellow}⚠️  Skipped (no admin token - create admin user first)${colors.reset}`);
    return false;
  }

  const result = await apiRequest('GET', '/api/users', null, adminToken);
  if (result.ok && result.data.success) {
    console.log(`${colors.green}✅ List users successful${colors.reset}`);
    console.log(`   Found ${result.data.data.users.length} users`);
    return true;
  } else {
    console.log(`${colors.red}❌ List users failed: ${result.data.error}${colors.reset}`);
    return false;
  }
}

async function testCreateUser() {
  console.log('\n➕ Testing Create User (Admin)...');
  if (!adminToken) {
    console.log(`${colors.yellow}⚠️  Skipped (no admin token)${colors.reset}`);
    return false;
  }

  const result = await apiRequest('POST', '/api/users', {
    name: 'API Test User',
    email: `apitest${Date.now()}@example.com`,
    password: 'ApiTest123',
    role: 'USER',
  }, adminToken);

  if (result.ok && result.data.success) {
    console.log(`${colors.green}✅ Create user successful${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.red}❌ Create user failed: ${result.data.error}${colors.reset}`);
    return false;
  }
}

async function testUnauthorizedAccess() {
  console.log('\n🚫 Testing Unauthorized Access...');
  const result = await apiRequest('GET', '/api/users');
  if (result.status === 401) {
    console.log(`${colors.green}✅ Unauthorized access correctly blocked${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.red}❌ Security issue: Unauthorized access allowed${colors.reset}`);
    return false;
  }
}

async function testValidation() {
  console.log('\n✔️  Testing Input Validation...');
  
  // Test weak password
  const weakPassword = await apiRequest('POST', '/api/auth/signup', {
    name: 'Test',
    email: `weak${Date.now()}@example.com`,
    password: 'weak',
  });
  
  if (!weakPassword.ok) {
    console.log(`${colors.green}✅ Weak password correctly rejected${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Weak password validation failed${colors.reset}`);
  }

  // Test invalid email
  const invalidEmail = await apiRequest('POST', '/api/auth/signup', {
    name: 'Test',
    email: 'invalid-email',
    password: 'Test1234',
  });
  
  if (!invalidEmail.ok) {
    console.log(`${colors.green}✅ Invalid email correctly rejected${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Email validation failed${colors.reset}`);
  }

  return true;
}

// Main test runner
async function runTests() {
  console.log(`${colors.blue}🚀 Starting API Tests...${colors.reset}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`${colors.yellow}Note: Make sure the dev server is running (npm run dev)${colors.reset}`);

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
  };

  // Run tests
  const tests = [
    { name: 'Signup', fn: testSignup },
    { name: 'Login', fn: testLogin },
    { name: 'Get Current User', fn: testGetCurrentUser },
    { name: 'Unauthorized Access', fn: testUnauthorizedAccess },
    { name: 'Input Validation', fn: testValidation },
    { name: 'List Users (Admin)', fn: testListUsers },
    { name: 'Create User (Admin)', fn: testCreateUser },
  ];

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result === true) {
        results.passed++;
      } else if (result === false) {
        results.failed++;
      } else {
        results.skipped++;
      }
    } catch (error) {
      console.log(`${colors.red}❌ ${test.name} threw error: ${error.message}${colors.reset}`);
      results.failed++;
    }
  }

  // Summary
  console.log(`\n${colors.blue}📊 Test Summary:${colors.reset}`);
  console.log(`${colors.green}✅ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Skipped: ${results.skipped}${colors.reset}`);

  if (results.failed === 0) {
    console.log(`\n${colors.green}🎉 All tests passed!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}⚠️  Some tests failed. Check the output above.${colors.reset}`);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('Error: This script requires Node.js 18+ with native fetch support');
  console.error('Alternatively, install node-fetch: npm install node-fetch');
  process.exit(1);
}

// Run tests
runTests().catch(console.error);

