// Database cleanup and verification script
// Run this in the browser console to check for data integrity issues

async function checkDatabaseIntegrity() {
  console.log('🔍 Checking database integrity...');
  
  try {
    // Check for orphaned services (services with invalid provider_id)
    console.log('📊 Checking for orphaned services...');
    
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('service_id, provider_id, title');
    
    if (servicesError) {
      console.error('❌ Error fetching services:', servicesError);
      return;
    }
    
    console.log(`📋 Found ${services.length} services`);
    
    for (const service of services) {
      // Check if provider exists
      const { data: provider, error: providerError } = await supabase
        .from('users')
        .select('user_id, name')
        .eq('user_id', service.provider_id)
        .single();
      
      if (providerError || !provider) {
        console.warn(`⚠️  Orphaned service found: ${service.title} (ID: ${service.service_id}) - provider ${service.provider_id} does not exist`);
      }
    }
    
    // Check for orphaned services with invalid category_id
    console.log('📊 Checking for services with invalid categories...');
    
    for (const service of services) {
      const { data: fullService, error: fullServiceError } = await supabase
        .from('services')
        .select('service_id, category_id, title')
        .eq('service_id', service.service_id)
        .single();
      
      if (fullService && fullService.category_id) {
        const { data: category, error: categoryError } = await supabase
          .from('categories')
          .select('category_id, name')
          .eq('category_id', fullService.category_id)
          .single();
        
        if (categoryError || !category) {
          console.warn(`⚠️  Service with invalid category: ${fullService.title} (ID: ${fullService.service_id}) - category ${fullService.category_id} does not exist`);
        }
      }
    }
    
    console.log('✅ Database integrity check complete');
    
  } catch (error) {
    console.error('❌ Error during integrity check:', error);
  }
}

// Also provide a cleanup function
async function cleanupOrphanedServices() {
  console.log('🧹 Starting cleanup of orphaned services...');
  
  try {
    // This would delete services with invalid foreign keys
    // CAREFUL: This will permanently delete data!
    
    console.log('⚠️  To run cleanup, uncomment the delete operations in the script');
    console.log('⚠️  This will permanently delete orphaned services!');
    
    /*
    const { error } = await supabase
      .from('services')
      .delete()
      .not('provider_id', 'in', 
        supabase.from('users').select('user_id')
      );
    */
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

console.log(`
🛠️  Database Integrity Tools Available:
- checkDatabaseIntegrity() - Check for orphaned records
- cleanupOrphanedServices() - Clean up invalid records (BE CAREFUL!)

Run: checkDatabaseIntegrity()
`);