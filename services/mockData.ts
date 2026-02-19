import { NewsItem, Category, User, SiteSettings } from '../types';

export const CATEGORIES: Category[] = [
  { 
    id: '1', 
    name: 'বাংলাদেশ', 
    slug: 'bangladesh',
    subCategories: [
      { id: '1-1', name: 'রাজনীতি', slug: 'politics' },
      { id: '1-2', name: 'অপরাধ', slug: 'crime' },
      { id: '1-3', name: 'শিক্ষা', slug: 'education' }
    ]
  },
  { 
    id: '2', 
    name: 'আন্তর্জাতিক', 
    slug: 'international',
    subCategories: [
      { id: '2-1', name: 'এশিয়া', slug: 'asia' },
      { id: '2-2', name: 'ইউরোপ', slug: 'europe' }
    ]
  },
  { id: '3', name: 'খেলা', slug: 'sports' },
  { id: '4', name: 'বিনোদন', slug: 'entertainment' },
  { id: '5', name: 'প্রযুক্তি', slug: 'technology' },
  { id: '6', name: 'অর্থনীতি', slug: 'economy' },
];

export const INITIAL_SETTINGS: SiteSettings = {
  areaTitle: 'মাতাজীহাট',
  areaDescription: 'মাতাজীহাট একটি সমৃদ্ধ ও ঐতিহ্যবাহী জনপদ। এখানকার কৃষি, সংস্কৃতি এবং সাম্প্রদায়িক সম্প্রীতি আমাদের গর্ব। "প্রাণের মাতাজীহাট" মাতাজীহাটের প্রতিটি ধূলিকণার সংবাদ সবার আগে আপনার কাছে পৌঁছে দিতে বদ্ধপরিকর। আমাদের লক্ষ্য এলাকার সমস্যা, সম্ভাবনা এবং উন্নয়নমূলক কর্মকাণ্ড বিশ্ববাসীর সামনে তুলে ধরা।',
  sliderImages: [
    'https://images.unsplash.com/photo-1589330273594-fade1ee91647?q=80&w=1200&auto=format&fit=crop', // Bangladesh Landscape
    'https://images.unsplash.com/photo-1628172922133-722a96866164?q=80&w=1200&auto=format&fit=crop'  // Village Life
  ]
};

export const MOCK_USER: User = {
  id: 'u1',
  name: 'রাফি আহমেদ',
  email: 'rafi@example.com',
  role: 'user', 
  avatar: 'https://picsum.photos/100/100',
  joinedAt: '2023-01-15T10:00:00Z'
};

export const MOCK_ADMIN: User = {
  id: 'a1',
  name: 'এডমিন',
  email: 'admin@khobor.com',
  role: 'admin',
  avatar: 'https://picsum.photos/101/101',
  joinedAt: '2023-01-01T10:00:00Z'
};

export const INITIAL_USERS: User[] = [
  MOCK_ADMIN,
  MOCK_USER,
  {
    id: 'u2',
    name: 'করিম চৌধুরী',
    email: 'karim@example.com',
    role: 'user',
    avatar: 'https://picsum.photos/102/102',
    joinedAt: '2023-05-20T14:00:00Z'
  },
  {
    id: 'u3',
    name: 'সুমাইয়া আক্তার',
    email: 'sumaiya@example.com',
    role: 'user',
    avatar: 'https://picsum.photos/103/103',
    joinedAt: '2023-06-10T09:30:00Z'
  },
  {
    id: 'sa1',
    name: 'সাব্বির হাসান',
    email: 'sabbir@subadmin.com',
    role: 'sub-admin',
    avatar: 'https://picsum.photos/104/104',
    joinedAt: '2023-08-01T09:00:00Z'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'পদ্মা সেতুতে যান চলাচলের নতুন রেকর্ড, একদিনে টোল আদায় ৪ কোটি',
    shortDescription: 'পদ্মা সেতু দিয়ে যান চলাচলের সব রেকর্ড ভেঙে গেছে। গত ২৪ ঘণ্টায় সেতু দিয়ে রেকর্ড সংখ্যক যানবাহন পারাপার হয়েছে।',
    fullDescription: 'পদ্মা সেতু দিয়ে যান চলাচলের সব রেকর্ড ভেঙে গেছে। গত ২৪ ঘণ্টায় সেতু দিয়ে রেকর্ড সংখ্যক যানবাহন পারাপার হয়েছে। বাংলাদেশ সেতু কর্তৃপক্ষ জানিয়েছে, গতকাল সকাল ৬টা থেকে আজ সকাল ৬টা পর্যন্ত মোট... (বিস্তারিত সংবাদ এখানে থাকবে)',
    category: 'bangladesh',
    imageUrl: 'https://picsum.photos/800/450?random=1',
    authorId: 'u2',
    authorName: 'নিজস্ব প্রতিবেদক',
    publishedAt: '2023-10-27T10:00:00Z',
    views: 12500,
    status: 'approved',
    tags: ['পদ্মা সেতু', 'উন্নয়ন'],
    isBreaking: true
  },
  {
    id: '2',
    title: 'বিশ্বকাপ ক্রিকেটে বাংলাদেশের অবিশ্বাস্য জয়',
    shortDescription: 'শ্বাসরুদ্ধকর ম্যাচে শেষ ওভারে জয় তুলে নিল বাংলাদেশ ক্রিকেট দল।',
    fullDescription: 'বিশ্বকাপের মঞ্চে আবারও গর্জে উঠল টাইগারা। গতকালের ম্যাচে দুর্দান্ত পারফর্মেন্স দেখিয়ে জয় ছিনিয়ে আনল সাকিবের দল। টসে জিতে প্রথমে ব্যাট করতে নেমে...',
    category: 'sports',
    imageUrl: 'https://picsum.photos/800/450?random=2',
    authorId: 'u1',
    authorName: 'ক্রীড়া প্রতিবেদক',
    publishedAt: '2023-10-26T18:30:00Z',
    views: 45000,
    status: 'approved',
    tags: ['ক্রিকেট', 'বিশ্বকাপ'],
    isBreaking: true
  },
  {
    id: '3',
    title: 'কৃত্রিম বুদ্ধিমত্তার নতুন বিপ্লব, চ্যাটজিপিটির নতুন সংস্করণ',
    shortDescription: 'ওপেনএআই নিয়ে এল চ্যাটজিপিটির আরও শক্তিশালী সংস্করণ।',
    fullDescription: 'প্রযুক্তি বিশ্বে আবারও তোলপাড়। চ্যাটজিপিটির নতুন সংস্করণ রিলিজ করেছে ওপেনএআই। এটি আগের চেয়ে অনেক বেশি দ্রুত এবং নির্ভুল তথ্য দিতে সক্ষম।',
    category: 'technology',
    imageUrl: 'https://picsum.photos/800/450?random=3',
    authorId: 'u3',
    authorName: 'টেক ডেস্ক',
    publishedAt: '2023-10-25T09:15:00Z',
    views: 8200,
    status: 'approved',
    tags: ['AI', 'ChatGPT'],
    isBreaking: false
  },
  {
    id: '4',
    title: 'গ্রামীনফোনের নতুন ইন্টারনেট অফার',
    shortDescription: 'গ্রাহকদের জন্য সুখবর, ডাটা প্যাকেজে বিশাল ছাড়।',
    fullDescription: 'ইন্টারনেট ব্যবহারকারীদের জন্য সুখবর নিয়ে এল গ্রামীণফোন। এখন থেকে স্বল্প মূল্যে আরও বেশি ডাটা পাওয়া যাবে।',
    category: 'technology',
    imageUrl: 'https://picsum.photos/800/450?random=4',
    authorId: 'u1',
    authorName: 'রাফি আহমেদ',
    publishedAt: '2023-10-28T10:00:00Z',
    views: 100,
    status: 'pending',
    tags: ['Telecom', 'Offer'],
    isBreaking: false
  }
];

// ImgBB Upload Service
export const uploadImageToImgBB = async (file: File): Promise<string> => {
  // NOTE: In a real app, this API key should be in .env
  // This is a demo key or logic placeholder.
  const API_KEY = 'YOUR_IMGBB_API_KEY_HERE'; 
  
  const formData = new FormData();
  formData.append('image', file);

  try {
    if (API_KEY === 'YOUR_IMGBB_API_KEY_HERE') {
      console.warn('ImgBB API Key missing. Returning mock URL.');
      return new Promise((resolve) => {
        setTimeout(() => resolve(URL.createObjectURL(file)), 1000);
      });
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error('Image upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};