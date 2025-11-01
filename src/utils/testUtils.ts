import { supabase } from '../config/supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return false;
  }
};

export const createMockCategories = async () => {
  try {
    console.log('Creating mock categories in Supabase...');
    
    const mockCategories = [
      { name: "Carpentry", icon: "🔨" },
      { name: "Electrical", icon: "⚡" },
      { name: "Plumbing", icon: "🔧" },
      { name: "Painting", icon: "🎨" },
      { name: "Cleaning", icon: "🧹" },
      { name: "Appliance Repair", icon: "🔌" },
      { name: "Pest Control", icon: "🐛" },
      { name: "Gardening", icon: "🌱" }
    ];

    const { data, error } = await (supabase
      .from('categories') as any)
      .upsert(mockCategories.map(cat => ({
        name: cat.name,
        icon: cat.icon,
        is_active: true
      })))
      .select();

    if (error) {
      console.error('Error creating categories:', error);
      return null;
    }

    console.log('Categories created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createMockCategories:', error);
    return null;
  }
};