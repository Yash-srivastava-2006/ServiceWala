// Environment and Connection Test
// Paste this in browser console to check configuration

function checkEnvironment() {
  console.log('🔍 Checking Environment Configuration...');
  
  // Check Vite environment variables
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  
  const supabaseConfig = {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  };
  
  console.log('🔥 Firebase Config:');
  Object.entries(firebaseConfig).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✅ Set' : '❌ Missing'}`);
  });
  
  console.log('🟢 Supabase Config:');
  Object.entries(supabaseConfig).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✅ Set' : '❌ Missing'}`);
  });
  
  // Check for placeholder values
  if (supabaseConfig.url === 'https://placeholder.supabase.co') {
    console.error('❌ CRITICAL: Supabase URL is still placeholder!');
  }
  
  if (supabaseConfig.anonKey === 'placeholder-anon-key') {
    console.error('❌ CRITICAL: Supabase anon key is still placeholder!');
  }
}

async function testBasicSupabaseConnection() {
  console.log('🔌 Testing basic Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      
      if (error.status === 406) {
        console.error('🚨 406 Error: This might be due to:');
        console.error('  - Incorrect Supabase URL or key');
        console.error('  - Database schema mismatch');
        console.error('  - Row Level Security blocking access');
      }
      
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

async function testUserTableAccess() {
  console.log('👥 Testing user table access...');
  
  try {
    // Test simple select
    const { data, error } = await supabase
      .from('users')
      .select('user_id, name, email')
      .limit(1);
    
    if (error) {
      console.error('❌ User table access failed:', error);
      
      if (error.code === 'PGRST116') {
        console.error('🚨 Table "users" does not exist or is not accessible');
      }
      
      return false;
    }
    
    console.log('✅ User table accessible');
    console.log('📊 Sample data:', data);
    return true;
  } catch (error) {
    console.error('❌ User table test failed:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Running all connection tests...\n');
  
  checkEnvironment();
  console.log('\n');
  
  const basicConnection = await testBasicSupabaseConnection();
  console.log('\n');
  
  if (basicConnection) {
    await testUserTableAccess();
  }
  
  console.log('\n🏁 Tests complete');
}

// Auto-run tests
runAllTests();