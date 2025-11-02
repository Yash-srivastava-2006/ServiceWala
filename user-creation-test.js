// User Creation Test Utility
// Run this in the browser console to test user creation manually

async function testUserCreation() {
  console.log('🧪 Testing User Creation...');
  
  try {
    // Test direct Supabase user creation
    const testUserData = {
      firebase_uid: 'test-uid-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      role: 'client',
      verified: false,
      avatar: 'https://ui-avatars.com/api/?name=Test%20User&background=3b82f6&color=fff'
    };
    
    console.log('📋 Test user data:', testUserData);
    
    // This assumes userService is available globally
    // You might need to import it in the browser console
    const result = await userService.upsertUser(testUserData);
    
    if (result) {
      console.log('✅ User creation successful:', result);
      
      // Clean up test user
      console.log('🧹 Cleaning up test user...');
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('firebase_uid', testUserData.firebase_uid);
      
      if (deleteError) {
        console.warn('⚠️ Failed to clean up test user:', deleteError);
      } else {
        console.log('✅ Test user cleaned up');
      }
    } else {
      console.error('❌ User creation failed - returned null');
    }
    
  } catch (error) {
    console.error('❌ User creation test failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
}

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
}

// Check current user in both Firebase and Supabase
async function checkCurrentUser() {
  console.log('👤 Checking current user status...');
  
  try {
    // Check Firebase user
    const { data: { user: firebaseUser } } = await supabase.auth.getUser();
    console.log('🔥 Firebase user:', firebaseUser?.id || 'Not logged in');
    
    if (firebaseUser) {
      // Check if user exists in Supabase
      const { data: supabaseUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', firebaseUser.id)
        .single();
      
      if (error || !supabaseUser) {
        console.error('❌ User exists in Firebase but not in Supabase!');
        console.error('This is the root cause of your issue.');
        console.log('🔧 You can fix this by running: fixCurrentUser()');
      } else {
        console.log('✅ User exists in both Firebase and Supabase:', supabaseUser.name);
      }
    }
  } catch (error) {
    console.error('❌ Error checking user status:', error);
  }
}

// Fix current user by creating Supabase record
async function fixCurrentUser() {
  console.log('🔧 Attempting to fix current user...');
  
  try {
    const { data: { user: firebaseUser } } = await supabase.auth.getUser();
    
    if (!firebaseUser) {
      console.error('❌ No Firebase user logged in');
      return;
    }
    
    const userData = {
      firebase_uid: firebaseUser.id,
      name: firebaseUser.user_metadata?.name || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      role: 'client', // Default role
      verified: firebaseUser.email_confirmed_at ? true : false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.email || 'User')}&background=3b82f6&color=fff`
    };
    
    console.log('📋 Creating Supabase user with data:', userData);
    
    const result = await userService.upsertUser(userData);
    
    if (result) {
      console.log('✅ User successfully created in Supabase:', result);
    } else {
      console.error('❌ Failed to create user in Supabase');
    }
    
  } catch (error) {
    console.error('❌ Error fixing current user:', error);
  }
}

console.log(`
🛠️ User Creation Debug Tools:
- testSupabaseConnection() - Test database connection
- testUserCreation() - Test user creation flow
- checkCurrentUser() - Check if current user exists in both systems
- fixCurrentUser() - Create missing Supabase record for current user

Run: checkCurrentUser() to start debugging
`);