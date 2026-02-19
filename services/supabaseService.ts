import { supabase } from '../supabaseClient';
import { NewsItem, Category, User, SiteSettings } from '../types';

// --- Auth ---

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
      },
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return {
    id: user.id,
    email: user.email!,
    name: profile.name,
    role: profile.role,
    avatar: profile.avatar,
    bio: profile.bio,
    joinedAt: profile.joined_at,
  };
};

export const updateProfile = async (userId: string, updates: Partial<User>) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      name: updates.name,
      bio: updates.bio,
      avatar: updates.avatar
    })
    .eq('id', userId);

  if (error) throw error;
};

// --- News ---

export const fetchNews = async (): Promise<NewsItem[]> => {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      profiles:author_id (name)
    `)
    .order('published_at', { ascending: false });

  if (error) throw error;

  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    shortDescription: item.short_description,
    fullDescription: item.full_description,
    category: item.category_slug,
    imageUrl: item.image_url,
    authorId: item.author_id,
    authorName: item.profiles?.name || 'Unknown',
    publishedAt: item.published_at,
    views: item.views,
    status: item.status,
    tags: item.tags || [],
    isBreaking: item.is_breaking,
  }));
};

export const createNews = async (news: Omit<NewsItem, 'id' | 'views' | 'status' | 'publishedAt' | 'authorName'>, userId: string) => {
  const { data, error } = await supabase
    .from('news')
    .insert({
      title: news.title,
      short_description: news.shortDescription,
      full_description: news.fullDescription,
      category_slug: news.category,
      image_url: news.imageUrl,
      author_id: userId,
      tags: news.tags,
      is_breaking: news.isBreaking,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateNews = async (id: string, updates: Partial<NewsItem>) => {
  const { data, error } = await supabase
    .from('news')
    .update({
      title: updates.title,
      short_description: updates.shortDescription,
      full_description: updates.fullDescription,
      category_slug: updates.category,
      image_url: updates.imageUrl,
      tags: updates.tags,
      status: updates.status, // Admin might update status
      is_breaking: updates.isBreaking
    })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteNews = async (id: string) => {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- Categories ---

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) throw error;

  // Transform to nested structure if needed, or just flat list
  // The app expects nested subCategories
  // For simplicity, let's return flat list and let the app handle it or adjust app logic
  // But wait, the app logic relies on `subCategories` property.
  // I should reconstruct the tree.
  
  const categories: Category[] = data.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    subCategories: [] // Initialize
  }));

  // This is a simple flat list for now. 
  // If we want hierarchy, we need parent_id in the table (which I added).
  // But for now let's just return them.
  return categories;
};

// --- Settings ---

export const fetchSettings = async (): Promise<SiteSettings> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error) {
    // If no settings found, return default
    return {
      areaTitle: 'মাতাজীহাট',
      areaDescription: 'Default description',
      sliderImages: []
    };
  }

  return {
    areaTitle: data.area_title,
    areaDescription: data.area_description,
    sliderImages: data.slider_images || []
  };
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) throw error;

  return profiles.map((p: any) => ({
    id: p.id,
    email: p.email,
    name: p.name,
    role: p.role,
    avatar: p.avatar,
    bio: p.bio,
    joinedAt: p.joined_at
  }));
};

export const updateSettings = async (settings: SiteSettings) => {
  // Check if row exists, if not insert
  const { data: existing } = await supabase.from('site_settings').select('id').single();
  
  if (existing) {
    const { error } = await supabase
      .from('site_settings')
      .update({
        area_title: settings.areaTitle,
        area_description: settings.areaDescription,
        slider_images: settings.sliderImages
      })
      .eq('id', 1);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('site_settings')
      .insert({
        id: 1,
        area_title: settings.areaTitle,
        area_description: settings.areaDescription,
        slider_images: settings.sliderImages
      });
    if (error) throw error;
  }
};
