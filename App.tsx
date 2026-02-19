import React, { useState, useEffect, useRef } from 'react';
import { Header, Footer, Sidebar, BreakingNewsTicker } from './components/Layout';
import { NewsItem, User, AppState, SiteSettings, Category } from './types';
import { uploadImageToImgBB } from './services/mockData';
import { 
  signIn, signUp, signOut, getCurrentUser, updateProfile,
  fetchNews, createNews, updateNews, deleteNews, 
  fetchCategories, fetchSettings, updateSettings, fetchUsers
} from './services/supabaseService';
import { Eye, Clock, ThumbsUp, MessageCircle, Share2, Upload, Trash2, CheckCircle, XCircle, Settings, Save, Edit, PlusCircle, ArrowLeft, Layers, Menu, User as UserIcon, Users, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

// --- Helper Components ---

// News Card
const NewsCard: React.FC<{ item: NewsItem; onClick: (id: string) => void; large?: boolean }> = ({ item, onClick, large }) => (
  <div onClick={() => onClick(item.id)} className={`group cursor-pointer ${large ? 'mb-6' : 'mb-4 flex gap-4'}`}>
    <div className={`overflow-hidden ${large ? 'w-full h-64 mb-3' : 'w-1/3 h-24 flex-shrink-0'}`}>
      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
    </div>
    <div className={large ? '' : 'w-2/3'}>
      <h3 className={`font-serif font-bold text-gray-800 group-hover:text-brand-red transition ${large ? 'text-2xl mb-2' : 'text-sm mb-1 line-clamp-2'}`}>
        {item.title}
      </h3>
      {large && <p className="text-gray-600 text-sm line-clamp-3 font-sans mb-2">{item.shortDescription}</p>}
      <div className="flex items-center text-gray-400 text-xs font-sans mt-1">
        <Clock className="w-3 h-3 mr-1" />
        <span className="mr-3">{new Date(item.publishedAt).toLocaleDateString('bn-BD')}</span>
        {large && (
          <>
             <Eye className="w-3 h-3 mr-1" />
             <span>{item.views}</span>
          </>
        )}
      </div>
    </div>
  </div>
);

// Home Slider Component
const HomeSlider: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-64 md:h-[400px] overflow-hidden rounded mb-8 shadow-sm group">
      <div
        className="whitespace-nowrap transition ease-in-out duration-1000"
        style={{ transform: `translate3d(${-currentIndex * 100}%, 0, 0)` }}
      >
        {images.map((img, index) => (
          <div
            className="inline-block w-full h-64 md:h-[400px]"
            key={index}
          >
            <img 
              src={img} 
              alt={`Slide ${index}`} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-brand-red text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            onClick={() => setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-brand-red text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            onClick={() => setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full cursor-pointer ${currentIndex === idx ? 'bg-brand-red' : 'bg-white/50'}`}
                onClick={() => setCurrentIndex(idx)}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- Pages ---

// Home Page
const Home: React.FC<{ news: NewsItem[]; settings: SiteSettings; onNewsClick: (id: string) => void }> = ({ news, settings, onNewsClick }) => {
  const approvedNews = news.filter(n => n.status === 'approved');
  const featured = approvedNews[0];
  const others = approvedNews.slice(1);

  return (
    <div className="container mx-auto px-4 py-6">
      
      {/* Slider Section */}
      <HomeSlider images={settings.sliderImages} />

      {/* Area Description Section */}
      <div className="bg-white p-6 rounded shadow-sm mb-8 border-l-4 border-brand-red">
        <h2 className="text-2xl font-serif font-bold mb-3 text-gray-800">আমাদের এলাকা: <span className="text-brand-red">{settings.areaTitle}</span></h2>
        <p className="text-gray-600 font-sans leading-relaxed text-lg">
          {settings.areaDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Featured News */}
          {featured && (
            <div className="mb-8 border-b pb-8">
              <NewsCard item={featured} onClick={onNewsClick} large />
            </div>
          )}

          {/* Category Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {others.map(item => (
              <NewsCard key={item.id} item={item} onClick={onNewsClick} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar news={approvedNews} onNewsClick={onNewsClick} />
        </div>
      </div>
    </div>
  );
};

// Category Page
const CategoryPage: React.FC<{ categorySlug: string; news: NewsItem[]; categories: Category[]; onNewsClick: (id: string) => void }> = ({ categorySlug, news, categories, onNewsClick }) => {
  // Find category (check main and sub categories)
  let categoryName = categorySlug;
  let targetCategory: Category | undefined;
  let parentCategory: Category | undefined;

  // Search logic
  for (const cat of categories) {
    if (cat.slug === categorySlug) {
      targetCategory = cat;
      break;
    }
    if (cat.subCategories) {
      const foundSub = cat.subCategories.find(sub => sub.slug === categorySlug);
      if (foundSub) {
        targetCategory = foundSub;
        parentCategory = cat;
        break;
      }
    }
  }

  if (targetCategory) categoryName = targetCategory.name;

  // Get all relevant slugs (if it's a parent, include children slugs)
  const relevantSlugs = [categorySlug];
  if (targetCategory && targetCategory.subCategories) {
    relevantSlugs.push(...targetCategory.subCategories.map(sc => sc.slug));
  }

  const categoryNews = news.filter(n => relevantSlugs.includes(n.category) && n.status === 'approved');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold mb-6 border-b pb-2 flex items-center gap-2">
        <span className="text-brand-red">#</span> 
        {parentCategory && <span className="text-gray-500 text-2xl">{parentCategory.name} &gt; </span>}
        {categoryName}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          {categoryNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryNews.map(item => (
                <NewsCard key={item.id} item={item} onClick={onNewsClick} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 text-gray-500">এই ক্যাটাগরিতে কোন খবর পাওয়া যায়নি।</div>
          )}
        </div>
        <div className="md:col-span-4">
          <Sidebar news={news.filter(n=>n.status === 'approved')} onNewsClick={onNewsClick} />
        </div>
      </div>
    </div>
  );
};

// Single News Detail
const NewsDetail: React.FC<{ item: NewsItem; categories: Category[]; news: NewsItem[]; onNewsClick: (id: string) => void }> = ({ item, categories, news, onNewsClick }) => {
  const approvedNews = news.filter(n => n.status === 'approved');
  
  // Resolve category name (handle subcategories)
  let catName = item.category;
  categories.forEach(c => {
    if(c.slug === item.category) catName = c.name;
    c.subCategories?.forEach(sc => {
      if(sc.slug === item.category) catName = sc.name;
    })
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar (Ads) */}
        <div className="hidden lg:block lg:col-span-2">
           <div className="bg-gray-100 h-[600px] sticky top-24 flex items-center justify-center text-gray-400 text-sm border text-center p-4">
             বিজ্ঞাপন (বামে)
           </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-7 bg-white p-6 shadow-sm rounded h-fit">
          <div className="mb-4">
            <span className="bg-brand-red text-white text-xs px-2 py-1 rounded">{catName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            {item.title}
          </h1>
          <div className="flex items-center justify-between border-b pb-4 mb-6 text-sm text-gray-500 font-sans">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                 {item.authorName.charAt(0)}
               </div>
               <div>
                 <p className="font-semibold text-gray-800">{item.authorName}</p>
                 <p>{new Date(item.publishedAt).toLocaleString('bn-BD')}</p>
               </div>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-1 hover:text-blue-600"><Share2 className="w-4 h-4"/> শেয়ার</button>
              <button className="flex items-center gap-1 hover:text-brand-red"><MessageCircle className="w-4 h-4"/> মন্তব্য</button>
            </div>
          </div>
          
          <img src={item.imageUrl} alt={item.title} className="w-full h-auto mb-6 rounded" />
          
          <div className="prose max-w-none font-serif text-lg leading-relaxed text-gray-800">
            <p className="font-bold mb-4">{item.shortDescription}</p>
            <p className="whitespace-pre-wrap">{item.fullDescription}</p>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-bold mb-3">ট্যাগ</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, idx) => (
                 <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 text-sm rounded-full cursor-pointer hover:bg-gray-200">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gray-100 h-64 flex items-center justify-center text-gray-400 text-sm border">
            বিজ্ঞাপন (ডানে উপরে)
          </div>
          <Sidebar news={approvedNews} onNewsClick={onNewsClick} />
          <div className="bg-gray-100 h-[400px] flex items-center justify-center text-gray-400 text-sm border sticky top-24">
            বিজ্ঞাপন (ডানে নিচে)
          </div>
        </div>

      </div>
    </div>
  );
};

// Login/Register
const AuthPage: React.FC<{ type: 'login' | 'register'; onLogin: (user: User) => void; onSwitch: () => void }> = ({ type, onLogin, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!validateEmail(email)) {
      setError('অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন।');
      return;
    }

    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setLoading(true);
    
    try {
      if (type === 'login') {
        const { user } = await signIn(email, password);
        if (user) {
          const currentUser = await getCurrentUser();
          if (currentUser) {
             onLogin(currentUser);
          } else {
             // Fallback if profile not created properly
             setError('প্রোফাইল লোড করতে সমস্যা হয়েছে।');
          }
        }
      } else {
        const { user, session } = await signUp(email, password, name);
        if (user) {
          if (session) {
             // Auto login if session exists (email confirmation disabled)
             alert('নিবন্ধন সফল হয়েছে!');
             onLogin(await getCurrentUser() as User);
          } else {
             // Email confirmation required
             alert('নিবন্ধন সফল হয়েছে! অনুগ্রহ করে আপনার ইমেইল চেক করুন এবং অ্যাকাউন্ট ভেরিফাই করুন।');
             onSwitch(); 
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'অথেন্টিকেশন ব্যর্থ হয়েছে';
      
      // Translate common Supabase errors
      if (msg.includes('Invalid login credentials')) msg = 'ইমেইল বা পাসওয়ার্ড ভুল।';
      if (msg.includes('Password should be at least 6 characters')) msg = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
      if (msg.includes('Email address') && msg.includes('is invalid')) msg = 'ইমেইল ঠিকানাটি সঠিক নয়।';
      if (msg.includes('email rate limit exceeded')) msg = 'অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।';
      if (msg.includes('User already registered')) msg = 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে।';

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md border-t-4 border-brand-red">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center text-gray-800">
          {type === 'login' ? 'লগইন করুন' : 'নিবন্ধন করুন'}
        </h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm font-sans">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border p-2 rounded focus:ring-1 focus:ring-brand-red outline-none" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border p-2 rounded focus:ring-1 focus:ring-brand-red outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border p-2 rounded focus:ring-1 focus:ring-brand-red outline-none" />
            {type === 'register' && <p className="text-xs text-gray-500 mt-1">কমপক্ষে ৬ অক্ষর</p>}
          </div>
          <button disabled={loading} type="submit" className="w-full bg-brand-red text-white py-2 rounded hover:bg-red-700 transition font-bold disabled:opacity-50">
            {loading ? 'অপেক্ষা করুন...' : (type === 'login' ? 'প্রবেশ করুন' : 'অ্যাকাউন্ট তৈরি করুন')}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          {type === 'login' ? 'অ্যাকাউন্ট নেই? ' : 'ইতিমধ্যে অ্যাকাউন্ট আছে? '}
          <button onClick={() => { setError(''); onSwitch(); }} className="text-blue-600 hover:underline">
            {type === 'login' ? 'নিবন্ধন করুন' : 'লগইন করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};

// User Dashboard (News Submission)
const UserDashboard: React.FC<{ 
  user: User; 
  news: NewsItem[]; 
  categories: Category[];
  onAddNews: (n: NewsItem) => void;
  onEditNews: (n: NewsItem) => void;
  onUpdateUser: (u: User) => void;
}> = ({ user, news, categories, onAddNews, onEditNews, onUpdateUser }) => {
  const [tab, setTab] = useState<'list' | 'create' | 'profile'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    fullDesc: '',
    category: categories[0]?.slug || '',
    tags: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myNews = news.filter(n => n.authorId === user.id);

  // Update local profile state when user prop updates
  useEffect(() => {
    setProfileData({
      name: user.name,
      email: user.email,
      bio: user.bio || '',
    });
  }, [user]);

  const resetForm = () => {
    setFormData({
      title: '',
      shortDesc: '',
      fullDesc: '',
      category: categories[0]?.slug || '',
      tags: '',
    });
    setImageFile(null);
    setEditingId(null);
  };

  const handleEditClick = (item: NewsItem) => {
    setFormData({
      title: item.title,
      shortDesc: item.shortDescription,
      fullDesc: item.fullDescription,
      category: item.category,
      tags: item.tags.join(', '),
    });
    setEditingId(item.id);
    setTab('create');
  };

  const handleCancelEdit = () => {
    resetForm();
    setTab('list');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Determine Image URL
    let imageUrl = 'https://picsum.photos/800/450';
    if (editingId) {
      const existingItem = news.find(n => n.id === editingId);
      if (existingItem) imageUrl = existingItem.imageUrl;
    }

    if (imageFile) {
      try {
        imageUrl = await uploadImageToImgBB(imageFile);
      } catch (err) {
        alert("Image upload failed");
        setIsSubmitting(false);
        return;
      }
    }

    if (editingId) {
      // Update existing
      const existingItem = news.find(n => n.id === editingId);
      if (existingItem) {
        const updatedItem: NewsItem = {
          ...existingItem,
          title: formData.title,
          shortDescription: formData.shortDesc,
          fullDescription: formData.fullDesc,
          category: formData.category,
          imageUrl,
          tags: formData.tags.split(',').map(t => t.trim()),
          status: 'pending' // Send back to approval on edit
        };
        onEditNews(updatedItem);
        alert('খবর আপডেট করা হয়েছে এবং অনুমোদনের জন্য পাঠানো হয়েছে!');
      }
    } else {
      // Create new
      const newItem: NewsItem = {
        id: 'n_' + Date.now(),
        title: formData.title,
        shortDescription: formData.shortDesc,
        fullDescription: formData.fullDesc,
        category: formData.category,
        imageUrl,
        authorId: user.id,
        authorName: user.name,
        publishedAt: new Date().toISOString(),
        views: 0,
        status: 'pending',
        tags: formData.tags.split(',').map(t => t.trim()),
        isBreaking: false
      };
      onAddNews(newItem);
      alert('খবর সাবমিট করা হয়েছে! এডমিন অনুমোদনের পর প্রকাশ হবে।');
    }

    setIsSubmitting(false);
    resetForm();
    setTab('list');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let avatarUrl = user.avatar || 'https://picsum.photos/100/100';

    if (avatarFile) {
      try {
        avatarUrl = await uploadImageToImgBB(avatarFile);
      } catch (err) {
        alert("Avatar upload failed");
        setIsSubmitting(false);
        return;
      }
    }

    const updatedUser: User = {
      ...user,
      name: profileData.name,
      email: profileData.email,
      bio: profileData.bio,
      avatar: avatarUrl
    };

    onUpdateUser(updatedUser);
    setIsSubmitting(false);
    alert('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 bg-white p-4 shadow rounded h-fit">
          <div className="text-center mb-6">
            <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-2 border-brand-red" />
            <h3 className="font-bold text-lg">{user.name}</h3>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded capitalize">{user.role}</span>
          </div>
          <button 
            onClick={() => { setTab('list'); resetForm(); }} 
            className={`w-full text-left p-2 rounded mb-1 flex items-center gap-2 ${tab === 'list' ? 'bg-brand-red text-white' : 'hover:bg-gray-100'}`}
          >
            <Settings className="w-4 h-4" /> আমার খবর
          </button>
          <button 
            onClick={() => { setTab('create'); resetForm(); }} 
            className={`w-full text-left p-2 rounded mb-1 flex items-center gap-2 ${tab === 'create' ? 'bg-brand-red text-white' : 'hover:bg-gray-100'}`}
          >
            <PlusCircle className="w-4 h-4" /> নতুন খবর যোগ করুন
          </button>
          <button 
            onClick={() => { setTab('profile'); resetForm(); }} 
            className={`w-full text-left p-2 rounded mb-1 flex items-center gap-2 ${tab === 'profile' ? 'bg-brand-red text-white' : 'hover:bg-gray-100'}`}
          >
            <UserIcon className="w-4 h-4" /> প্রোফাইল সেটিংস
          </button>
        </div>

        <div className="w-full md:w-3/4 bg-white p-6 shadow rounded">
          {tab === 'list' && (
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">আমার খবরের তালিকা</h2>
              {myNews.length === 0 ? <p className="text-gray-500">কোন খবর পাওয়া যায়নি।</p> : (
                <div className="space-y-4">
                  {myNews.map(item => (
                    <div key={item.id} className="flex justify-between items-center border p-3 rounded hover:bg-gray-50">
                      <div>
                        <h4 className="font-bold">{item.title}</h4>
                        <div className="text-xs flex gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-white ${
                            item.status === 'approved' ? 'bg-green-500' : 
                            item.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                          <span className="text-gray-500">{new Date(item.publishedAt).toLocaleDateString('bn-BD')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditClick(item)} 
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-semibold border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition"
                        >
                          <Edit className="w-3 h-3" /> এডিট
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'create' && (
            <div>
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-bold">{editingId ? 'খবর এডিট করুন' : 'নতুন খবর যোগ করুন'}</h2>
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-gray-500 text-sm flex items-center gap-1 hover:text-gray-700">
                    <ArrowLeft className="w-4 h-4"/> ফিরে যান
                  </button>
                )}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                <div>
                  <label className="block text-sm font-semibold mb-1">শিরোনাম</label>
                  <input required type="text" className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-semibold mb-1">ক্যাটাগরি</label>
                   <select className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                     {categories.map(c => (
                       <React.Fragment key={c.id}>
                         <option value={c.slug}>{c.name}</option>
                         {c.subCategories?.map(sub => (
                           <option key={sub.id} value={sub.slug}>&nbsp;&nbsp;&nbsp;-- {sub.name}</option>
                         ))}
                       </React.Fragment>
                     ))}
                   </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ফিচার ইমেজ (ImgBB Upload)</label>
                  {editingId && (
                     <p className="text-xs text-gray-500 mb-1">ছবি পরিবর্তন করতে না চাইলে খালি রাখুন।</p>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="w-full border p-2 rounded" 
                    onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
                    required={!editingId} // Required only for new posts
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">সংক্ষিপ্ত বিবরণ</label>
                  <textarea required rows={2} className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">বিস্তারিত</label>
                  <textarea required rows={8} className="w-full border p-2 rounded font-serif focus:outline-none focus:border-brand-red" value={formData.fullDesc} onChange={e => setFormData({...formData, fullDesc: e.target.value})} placeholder="এখানে বিস্তারিত লিখুন..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ট্যাগ (কমা দিয়ে আলাদা করুন)</label>
                  <input type="text" className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="যেমন: বাংলাদেশ, নির্বাচন, রাজনীতি" />
                </div>
                <button disabled={isSubmitting} type="submit" className="bg-brand-red text-white px-6 py-2 rounded hover:bg-red-700 font-bold w-full md:w-auto flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    'প্রসেসিং...'
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> {editingId ? 'আপডেট করুন' : 'সাবমিট করুন'}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {tab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">প্রোফাইল সেটিংস</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4 font-sans max-w-lg">
                 <div>
                    <label className="block text-sm font-semibold mb-1">প্রোফাইল ছবি</label>
                    <div className="flex items-center gap-4 mb-2">
                      <img src={user.avatar} alt="Current" className="w-16 h-16 rounded-full object-cover border" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => setAvatarFile(e.target.files ? e.target.files[0] : null)}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100"
                      />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold mb-1">নাম</label>
                    <input type="text" required value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold mb-1">ইমেইল</label>
                    <input type="email" required value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold mb-1">বায়ো (Bio)</label>
                    <textarea rows={3} value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" placeholder="আপনার সম্পর্কে কিছু লিখুন..." />
                 </div>
                 <button disabled={isSubmitting} type="submit" className="bg-brand-red text-white px-6 py-2 rounded hover:bg-red-700 font-bold transition flex items-center gap-2">
                    {isSubmitting ? 'আপডেট হচ্ছে...' : <><Save className="w-4 h-4" /> সেভ করুন</>}
                 </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard: React.FC<{ 
  currentUser: User;
  news: NewsItem[]; 
  settings: SiteSettings;
  categories: Category[];
  users: User[];
  onUpdateStatus: (id: string, status: NewsItem['status']) => void; 
  onDelete: (id: string) => void;
  onUpdateSettings: (s: SiteSettings) => void;
  onAddCategory: (name: string, parentId?: string) => void;
  onDeleteCategory: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onAddUser: (u: User) => void;
  onEditUser: (u: User) => void;
}> = ({ currentUser, news, settings, categories, users, onUpdateStatus, onDelete, onUpdateSettings, onAddCategory, onDeleteCategory, onDeleteUser, onAddUser, onEditUser }) => {
  const pendingNews = news.filter(n => n.status === 'pending');
  // For 'all' tab, show everything so admin can find any news to delete
  const allNews = news; 
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState<'stats' | 'pending' | 'all' | 'categories' | 'users' | 'settings'>('stats');

  const isSuperAdmin = currentUser.role === 'admin';

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    alert('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const [newCatName, setNewCatName] = useState('');
  const [newCatParent, setNewCatParent] = useState<string>('');

  // User Management State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'user' as User['role'],
    bio: ''
  });
  const [userAvatarFile, setUserAvatarFile] = useState<File | null>(null);

  // Settings Slider State
  const [newSliderImageFile, setNewSliderImageFile] = useState<File | null>(null);
  const [isUploadingSlider, setIsUploadingSlider] = useState(false);

  const handleOpenUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio || ''
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        name: '',
        email: '',
        role: 'user',
        bio: ''
      });
    }
    setUserAvatarFile(null);
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let avatarUrl = editingUser?.avatar || 'https://picsum.photos/100/100';
    
    if (userAvatarFile) {
        try {
           avatarUrl = await uploadImageToImgBB(userAvatarFile);
        } catch(e) {
           alert("Avatar upload failed");
           return;
        }
    }

    const userData: User = {
       id: editingUser ? editingUser.id : 'u_' + Date.now(),
       name: userFormData.name,
       email: userFormData.email,
       role: userFormData.role,
       bio: userFormData.bio,
       avatar: avatarUrl,
       joinedAt: editingUser ? editingUser.joinedAt : new Date().toISOString()
    };

    if (editingUser) {
      onEditUser(userData);
    } else {
      onAddUser(userData);
    }
    setIsUserModalOpen(false);
  };

  const handleAddSliderImage = async () => {
    if (!newSliderImageFile) return;
    setIsUploadingSlider(true);
    try {
      const url = await uploadImageToImgBB(newSliderImageFile);
      setLocalSettings(prev => ({
        ...prev,
        sliderImages: [...prev.sliderImages, url]
      }));
      setNewSliderImageFile(null);
    } catch (e) {
      alert("Image upload failed");
    } finally {
      setIsUploadingSlider(false);
    }
  };

  const handleRemoveSliderImage = (index: number) => {
    setLocalSettings(prev => ({
      ...prev,
      sliderImages: prev.sliderImages.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-serif border-l-4 border-brand-red pl-3 flex items-center justify-between">
         <span>এডমিন প্যানেল</span>
         <span className="text-sm font-normal bg-gray-200 px-3 py-1 rounded text-gray-700">
           {isSuperAdmin ? 'Super Admin' : 'Sub Admin'}
         </span>
      </h1>
      
      {/* Admin Nav */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 ${activeTab === 'stats' ? 'border-b-2 border-brand-red font-bold text-brand-red' : 'text-gray-600'}`}>ড্যাশবোর্ড</button>
        <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 ${activeTab === 'pending' ? 'border-b-2 border-brand-red font-bold text-brand-red' : 'text-gray-600'}`}>অপেক্ষমান ({pendingNews.length})</button>
        <button onClick={() => setActiveTab('all')} className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-brand-red font-bold text-brand-red' : 'text-gray-600'}`}>সকল সংবাদ</button>
        
        {isSuperAdmin && (
          <>
            <button onClick={() => setActiveTab('categories')} className={`px-4 py-2 flex items-center gap-1 ${activeTab === 'categories' ? 'border-b-2 border-brand-red font-bold text-brand-red' : 'text-gray-600'}`}>
              <Layers className="w-4 h-4" /> ক্যাটাগরি
            </button>
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 flex items-center gap-1 ${activeTab === 'users' ? 'border-b-2 border-brand-red font-bold text-brand-red' : 'text-gray-600'}`}>
              <Users className="w-4 h-4" /> ইউজার
            </button>
            <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 flex items-center gap-1 ${activeTab === 'settings' ? 'border-b-2 border-brand-red font-bold text-brand-red' : 'text-gray-600'}`}>
              <Settings className="w-4 h-4" /> সেটিংস
            </button>
          </>
        )}
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded shadow">
            <h3 className="text-xl font-bold">মোট নিউজ</h3>
            <p className="text-4xl font-bold mt-2">{news.length}</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded shadow">
            <h3 className="text-xl font-bold">অপেক্ষমান</h3>
            <p className="text-4xl font-bold mt-2">{pendingNews.length}</p>
          </div>
          {isSuperAdmin && (
            <>
              <div className="bg-green-500 text-white p-6 rounded shadow">
                <h3 className="text-xl font-bold">ব্যবহারকারী</h3>
                <p className="text-4xl font-bold mt-2">{users.length}</p>
              </div>
              <div className="bg-purple-500 text-white p-6 rounded shadow">
                <h3 className="text-xl font-bold">ক্যাটাগরি</h3>
                <p className="text-4xl font-bold mt-2">{categories.length}</p>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="bg-white shadow rounded p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">অপেক্ষমান সংবাদ (Pending)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">শিরোনাম</th>
                  <th className="p-3">লেখক</th>
                  <th className="p-3">তারিখ</th>
                  <th className="p-3 text-right">একশন</th>
                </tr>
              </thead>
              <tbody>
                {pendingNews.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-gray-500">কোন পেন্ডিং নিউজ নেই</td></tr>
                ) : pendingNews.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 max-w-xs truncate">{item.title}</td>
                    <td className="p-3">{item.authorName}</td>
                    <td className="p-3 text-sm">{new Date(item.publishedAt).toLocaleDateString('bn-BD')}</td>
                    <td className="p-3 flex justify-end gap-2">
                      <button onClick={() => onUpdateStatus(item.id, 'approved')} className="text-green-600 hover:bg-green-100 p-1 rounded" title="Approve"><CheckCircle className="w-5 h-5"/></button>
                      <button onClick={() => onUpdateStatus(item.id, 'rejected')} className="text-red-600 hover:bg-red-100 p-1 rounded" title="Reject"><XCircle className="w-5 h-5"/></button>
                      {isSuperAdmin && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} 
                          className="text-red-500 hover:bg-red-100 p-1 rounded" 
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5"/>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'all' && (
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-bold mb-4">সকল সংবাদ</h2>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">শিরোনাম</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  {isSuperAdmin && <th className="p-3 text-right">একশন</th>}
                </tr>
              </thead>
              <tbody>
                 {allNews.map(item => (
                   <tr key={item.id} className="border-b hover:bg-gray-50">
                     <td className="p-3 max-w-md truncate font-serif">{item.title}</td>
                     <td className="p-3">
                       <span className={`text-xs px-2 py-1 rounded ${item.status === 'approved' ? 'bg-green-100 text-green-800' : 
                         item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                         {item.status.toUpperCase()}
                       </span>
                     </td>
                     {isSuperAdmin && (
                       <td className="p-3 text-right">
                         <button 
                           onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} 
                           className="text-red-500 hover:text-red-700"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </td>
                     )}
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isSuperAdmin && activeTab === 'categories' && (
        <div className="bg-white shadow rounded p-6 max-w-2xl">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">ক্যাটাগরি ম্যানেজমেন্ট</h2>
          
          <div className="flex gap-2 mb-6">
            <div className="flex-grow flex gap-2">
              <input 
                type="text" 
                placeholder="নতুন ক্যাটাগরির নাম..." 
                className="border p-2 rounded flex-grow focus:outline-none focus:border-brand-red"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <select 
                className="border p-2 rounded max-w-[150px] focus:outline-none"
                value={newCatParent}
                onChange={(e) => setNewCatParent(e.target.value)}
              >
                <option value="">মূল ক্যাটাগরি</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button 
              onClick={() => {
                 if(newCatName.trim()) {
                   onAddCategory(newCatName, newCatParent);
                   setNewCatName('');
                   setNewCatParent('');
                 }
              }}
              className="bg-brand-red text-white px-6 py-2 rounded font-bold hover:bg-red-700"
            >
              যোগ করুন
            </button>
          </div>

          <div className="bg-gray-50 rounded border">
             {categories.length === 0 ? <p className="p-4 text-center text-gray-500">কোন ক্যাটাগরি নেই</p> : (
               categories.map(c => (
                 <React.Fragment key={c.id}>
                   <div className="flex justify-between items-center border-b last:border-0 p-3 hover:bg-white transition">
                     <div>
                       <span className="font-semibold block">{c.name}</span>
                       <span className="text-xs text-gray-400">slug: {c.slug}</span>
                     </div>
                     <button 
                       onClick={(e) => { e.stopPropagation(); onDeleteCategory(c.id); }}
                       className="text-red-500 hover:bg-red-100 p-2 rounded"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                   {/* Render Sub Categories */}
                   {c.subCategories?.map(sub => (
                      <div key={sub.id} className="flex justify-between items-center border-b last:border-0 p-3 pl-8 bg-gray-50 hover:bg-white transition">
                        <div className="flex items-center gap-2">
                          <ArrowLeft className="w-3 h-3 text-gray-400 rotate-180" />
                          <div>
                            <span className="font-medium block text-sm">{sub.name}</span>
                            <span className="text-xs text-gray-400">slug: {sub.slug}</span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteCategory(sub.id); }}
                          className="text-red-500 hover:bg-red-100 p-2 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                   ))}
                 </React.Fragment>
               ))
             )}
          </div>
        </div>
      )}

      {isSuperAdmin && activeTab === 'users' && (
        <div className="bg-white shadow rounded p-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold">রেজিস্টার করা ইউজার তালিকা ({users.length})</h2>
             <button onClick={() => handleOpenUserModal()} className="bg-brand-red text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold hover:bg-red-700">
               <PlusCircle className="w-4 h-4" /> নতুন ইউজার
             </button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">ইউজার</th>
                  <th className="p-3">ইমেইল</th>
                  <th className="p-3">রোল</th>
                  <th className="p-3">জয়েনিং ডেট</th>
                  <th className="p-3 text-right">একশন</th>
                </tr>
              </thead>
              <tbody>
                 {users.map(u => (
                   <tr key={u.id} className="border-b hover:bg-gray-50">
                     <td className="p-3 flex items-center gap-2">
                       <img src={u.avatar} className="w-8 h-8 rounded-full" alt="" />
                       <span className="font-semibold">{u.name}</span>
                     </td>
                     <td className="p-3 text-sm">{u.email}</td>
                     <td className="p-3">
                       <span className={`text-xs px-2 py-1 rounded uppercase font-bold
                         ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                           u.role === 'sub-admin' ? 'bg-blue-100 text-blue-800' : 
                           'bg-gray-200 text-gray-800'}`}>
                         {u.role === 'admin' ? 'সুপার এডমিন' : u.role === 'sub-admin' ? 'সাব এডমিন' : 'ইউজার'}
                       </span>
                     </td>
                     <td className="p-3 text-sm">{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString('bn-BD') : '-'}</td>
                     <td className="p-3 text-right flex justify-end gap-2">
                       <button onClick={() => handleOpenUserModal(u)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded" title="Edit User">
                          <Edit className="w-4 h-4" />
                       </button>
                       {currentUser.id !== u.id && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); onDeleteUser(u.id); }}
                           className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded" 
                           title="Delete User"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       )}
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Edit/Create Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
             <div className="flex justify-between items-center p-4 border-b bg-gray-50">
               <h3 className="font-bold text-lg text-gray-800">{editingUser ? 'তথ্য হালনাগাদ করুন' : 'নতুন ইউজার তৈরি করুন'}</h3>
               <button onClick={() => setIsUserModalOpen(false)} className="text-gray-500 hover:text-red-500 transition">
                 <X className="w-5 h-5" />
               </button>
             </div>
             <form onSubmit={handleUserSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">নাম</label>
                  <input required type="text" className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ইমেইল</label>
                  <input required type="email" className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">রোল (Role)</label>
                  <select className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value as any})}>
                    <option value="user">সাধারণ ইউজার</option>
                    <option value="sub-admin">সাব এডমিন</option>
                    <option value="admin">সুপার এডমিন</option>
                  </select>
                </div>
                 <div>
                    <label className="block text-sm font-semibold mb-1">অবাতার (ঐচ্ছিক)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => setUserAvatarFile(e.target.files ? e.target.files[0] : null)}
                      className="w-full border p-2 rounded text-sm"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold mb-1">বায়ো (Bio)</label>
                    <textarea rows={3} className="w-full border p-2 rounded focus:outline-none focus:border-brand-red" value={userFormData.bio} onChange={e => setUserFormData({...userFormData, bio: e.target.value})} />
                 </div>
                 <button type="submit" className="w-full bg-brand-red text-white py-2 rounded font-bold hover:bg-red-700 transition">
                   {editingUser ? 'আপডেট করুন' : 'তৈরি করুন'}
                 </button>
             </form>
           </div>
        </div>
      )}

      {isSuperAdmin && activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b">হোমপেজ সেটিংস</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">এলাকার নাম (Title)</label>
                    <input 
                      type="text" 
                      className="w-full border p-3 rounded focus:outline-none focus:border-brand-red" 
                      value={localSettings.areaTitle} 
                      onChange={e => setLocalSettings({...localSettings, areaTitle: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">এলাকার বিবরণ (Description)</label>
                    <textarea 
                      rows={6} 
                      className="w-full border p-3 rounded focus:outline-none focus:border-brand-red" 
                      value={localSettings.areaDescription} 
                      onChange={e => setLocalSettings({...localSettings, areaDescription: e.target.value})} 
                    />
                    <p className="text-sm text-gray-500 mt-1">এটি হোমপেজের উপরে প্রদর্শিত হবে।</p>
                </div>
                <button onClick={handleSaveSettings} className="flex items-center gap-2 bg-brand-red text-white px-6 py-2 rounded hover:bg-red-700 font-bold transition">
                  <Save className="w-4 h-4" /> সেটিংস সংরক্ষণ করুন
                </button>
            </div>
          </div>

          <div className="bg-white shadow rounded p-6 h-fit">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b">স্লাইডার ইমেজ সেটিংস</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">নতুন ছবি আপলোড করুন</label>
              <div className="flex gap-2">
                 <input 
                    type="file" 
                    accept="image/*" 
                    className="border p-2 rounded w-full text-sm"
                    onChange={e => setNewSliderImageFile(e.target.files ? e.target.files[0] : null)}
                 />
                 <button 
                    disabled={!newSliderImageFile || isUploadingSlider}
                    onClick={handleAddSliderImage}
                    className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                 >
                   {isUploadingSlider ? 'Uploading...' : <><Upload className="w-4 h-4" /> যোগ করুন</>}
                 </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-600">বর্তমান ছবিসমূহ ({localSettings.sliderImages.length})</h3>
              {localSettings.sliderImages.map((img, idx) => (
                <div key={idx} className="flex items-center justify-between border p-2 rounded bg-gray-50">
                   <div className="flex items-center gap-3">
                     <span className="font-bold text-gray-400">{idx + 1}.</span>
                     <img src={img} alt="Slider" className="w-16 h-10 object-cover rounded border" />
                   </div>
                   <button onClick={() => handleRemoveSliderImage(idx)} className="text-red-500 hover:bg-red-100 p-2 rounded transition">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    areaTitle: 'Loading...',
    areaDescription: '',
    sliderImages: []
  });
  const [users, setUsers] = useState<User[]>([]); // Admin only needs this really
  const [state, setState] = useState<AppState>({
    currentPage: 'home',
    selectedNewsId: null,
    selectedCategory: null,
    user: null // Start as guest
  });
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [fetchedNews, fetchedCategories, fetchedSettings] = await Promise.all([
          fetchNews(),
          fetchCategories(),
          fetchSettings()
        ]);
        setNews(fetchedNews);
        setCategories(fetchedCategories);
        setSettings(fetchedSettings);
        
        // Check auth
        const user = await getCurrentUser();
        if (user) {
          setState(prev => ({ ...prev, user }));
          if (user.role === 'admin' || user.role === 'sub-admin') {
             const fetchedUsers = await fetchUsers();
             setUsers(fetchedUsers);
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Basic Routing Handlers
  const navigate = (page: AppState['currentPage'], newsId: string | null = null) => {
    setState(prev => ({ ...prev, currentPage: page, selectedNewsId: newsId }));
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (slug: string) => {
    setState(prev => ({ ...prev, currentPage: 'category', selectedCategory: slug }));
    window.scrollTo(0, 0);
  };

  const handleLogin = (user: User) => {
    const dashboardPage = (user.role === 'admin' || user.role === 'sub-admin') ? 'admin-dashboard' : 'home';
    setState(prev => ({ ...prev, user, currentPage: dashboardPage }));
  };

  const handleLogout = async () => {
    await signOut();
    setState(prev => ({ ...prev, user: null, currentPage: 'home' }));
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await updateProfile(updatedUser.id, updatedUser);
      setState(prev => ({ ...prev, user: updatedUser }));
    } catch (e) {
      console.error(e);
      alert('Failed to update profile');
    }
  };

  const handleAdminAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleAdminEditUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleAddNews = async (item: NewsItem) => {
    if (!state.user) return;
    try {
      // Omit ID and other auto-fields
      const { id, views, status, publishedAt, authorName, ...newsData } = item;
      await createNews(newsData, state.user.id);
      // Refresh news
      const updatedNews = await fetchNews();
      setNews(updatedNews);
    } catch (e) {
      console.error(e);
      alert('Failed to create news');
    }
  };

  const handleEditNews = async (updatedItem: NewsItem) => {
    try {
      await updateNews(updatedItem.id, updatedItem);
      const updatedNews = await fetchNews();
      setNews(updatedNews);
    } catch (e) {
      console.error(e);
      alert('Failed to update news');
    }
  };

  const handleStatusUpdate = async (id: string, status: NewsItem['status']) => {
    try {
      await updateNews(id, { status });
      setNews(prev => prev.map(n => n.id === id ? { ...n, status } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm('আপনি কি নিশ্চিত এই নিউজটি মুছে ফেলতে চান?')) {
      try {
        await deleteNews(id);
        setNews(prev => prev.filter(n => n.id !== id));
      } catch (e) {
        console.error(e);
        alert('Failed to delete news');
      }
    }
  };

  const handleUpdateSettings = async (newSettings: SiteSettings) => {
    try {
      await updateSettings(newSettings);
      setSettings(newSettings);
    } catch (e) {
      console.error(e);
      alert('Failed to update settings');
    }
  };

  const handleAddCategory = (name: string, parentId?: string) => {
     // Implement Supabase category add
     alert("Category management via Supabase not fully implemented in this demo step.");
  };

  const handleDeleteCategory = (id: string) => {
     // Implement Supabase category delete
     alert("Category management via Supabase not fully implemented in this demo step.");
  };

  const handleDeleteUser = (id: string) => {
    // Implement Supabase user delete (admin only)
    alert("User management via Supabase not fully implemented in this demo step.");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Render Page Content based on State
  const renderContent = () => {
    switch (state.currentPage) {
      case 'home':
        return <Home news={news} settings={settings} onNewsClick={(id) => navigate('news-detail', id)} />;
      case 'category':
        return state.selectedCategory ? 
          <CategoryPage categorySlug={state.selectedCategory} news={news} categories={categories} onNewsClick={(id) => navigate('news-detail', id)} /> :
          <Home news={news} settings={settings} onNewsClick={(id) => navigate('news-detail', id)} />;
      case 'news-detail':
        const item = news.find(n => n.id === state.selectedNewsId);
        return item ? <NewsDetail item={item} categories={categories} news={news} onNewsClick={(id) => navigate('news-detail', id)} /> : <div>Not Found</div>;
      case 'login':
        return <AuthPage type="login" onLogin={handleLogin} onSwitch={() => navigate('register')} />;
      case 'register':
        return <AuthPage type="register" onLogin={handleLogin} onSwitch={() => navigate('login')} />;
      case 'user-dashboard':
        return state.user ? <UserDashboard user={state.user} news={news} categories={categories} onAddNews={handleAddNews} onEditNews={handleEditNews} onUpdateUser={handleUpdateUser} /> : <div className="text-center py-20">Access Denied</div>;
      case 'admin-dashboard':
        return state.user && (state.user.role === 'admin' || state.user.role === 'sub-admin') ? 
          <AdminDashboard 
            currentUser={state.user}
            news={news} 
            settings={settings}
            categories={categories}
            users={users}
            onUpdateStatus={handleStatusUpdate} 
            onDelete={handleDeleteNews} 
            onUpdateSettings={handleUpdateSettings}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onDeleteUser={handleDeleteUser}
            onAddUser={handleAdminAddUser}
            onEditUser={handleAdminEditUser}
          /> : 
          <div className="text-center py-20">Access Denied</div>;
      default:
        return <Home news={news} settings={settings} onNewsClick={(id) => navigate('news-detail', id)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f9fafb]">
      <Header 
        user={state.user} 
        categories={categories}
        onNavigate={(p) => navigate(p as any)} 
        onLogout={handleLogout} 
        onSearch={(q) => console.log('Searching', q)}
        onCategoryClick={handleCategoryClick}
      />
      
      <BreakingNewsTicker news={news.filter(n => n.status === 'approved')} />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

export default App;