// Specific user creation debug test
// Run this in browser console after signing up fails

async function debugUserCreation() {
  console.log('🐛 Debugging User Creation Issue...');
  
  // Check if we can access the users table at all
  console.log('1️⃣ Testing basic table access...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Cannot access users table:', error);
      return;
    }
    console.log('✅ Users table accessible');
  } catch (error) {
    console.error('❌ Table access failed:', error);
    return;
  }
  
  // Test if we can insert data at all
  console.log('2️⃣ Testing direct insert capability...');
  const testData = {
    firebase_uid: 'test-uid-' + Date.now(),
    name: 'Test User',
    email: 'test@example.com',
    role: 'client',
    verified: false
  };
  
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Direct insert failed:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      if (error.code === '42501') {
        console.error('🚨 Permission denied - RLS policy blocking insert');
        console.log('💡 Check your Supabase RLS policies for the users table');
      }
      
      if (error.code === '23505') {
        console.error('🚨 Unique constraint violation');
      }
      
      return;
    }
    
    console.log('✅ Direct insert successful:', data);
    
    // Clean up test data
    await supabase
      .from('users')
      .delete()
      .eq('firebase_uid', testData.firebase_uid);
    
    console.log('🧹 Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Direct insert test failed:', error);
  }
  
  // Check RLS policies
  console.log('3️⃣ Checking authentication status...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Auth check failed:', error);
    } else if (user) {
      console.log('✅ User authenticated:', user.email);
      console.log('🆔 User ID:', user.id);
    } else {
      console.log('ℹ️ No authenticated user');
    }
  } catch (error) {
    console.error('❌ Auth status check failed:', error);
  }
}

// Test with actual user data from failed signup
async function testFailedSignup(firebaseUid, name, email, role = 'client') {
  console.log('🔄 Testing failed signup data...');
  console.log('Data:', { firebaseUid, name, email, role });
  
  const userData = {
    firebase_uid: firebaseUid,
    name: name,
    email: email,
    role: role,
    verified: false,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`
  };
  
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, {
        onConflict: 'firebase_uid'
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Upsert failed:', error);
      return null;
    }
    
    console.log('✅ Manual upsert successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Manual test failed:', error);
    return null;
  }
}

console.log(`
🛠️ User Creation Debug Tools:
- debugUserCreation() - Run comprehensive debugging
- testFailedSignup(firebaseUid, name, email, role) - Test specific user data

Example: testFailedSignup('abc123', 'John Doe', 'john@example.com', 'client')
`);

// Auto-run basic debug
debugUserCreation();