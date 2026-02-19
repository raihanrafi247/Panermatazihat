import React, { useState } from 'react';
import { User, Category, NewsItem } from '../types';
import { Menu, Search, User as UserIcon, LogOut, Facebook, Twitter, Instagram, Youtube, ChevronDown } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  categories: Category[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onCategoryClick: (slug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, categories, onNavigate, onLogout, onSearch, onCategoryClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const today = new Date().toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-brand-black text-gray-200 text-xs py-1 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <span>{today}</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">About Us</a>
            <a href="#" className="hover:text-white">Contact</a>
            {user ? (
               <div className="flex items-center gap-2">
                 <span>স্বাগতম, {user.name}</span>
                 <button onClick={onLogout} className="hover:text-red-400 font-bold">লগআউট</button>
               </div>
            ) : (
              <div className="flex gap-2">
                 <button onClick={() => onNavigate('login')} className="hover:text-white">লগইন</button>
                 <span>|</span>
                 <button onClick={() => onNavigate('register')} className="hover:text-white">রেজিস্ট্রেশন</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <div 
              className="text-3xl md:text-4xl font-serif font-bold text-brand-red cursor-pointer" 
              onClick={() => onNavigate('home')}
            >
              প্রাণের মাতাজীহাট
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                type="text" 
                placeholder="খুঁজুন..." 
                className="border border-gray-300 rounded-full py-1 px-4 pr-10 focus:outline-none focus:border-brand-red text-sm font-sans"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search className="w-4 h-4" />
              </button>
            </form>
            {user && (
              <button 
                onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm font-semibold transition"
              >
                <UserIcon className="w-4 h-4" />
                {user.role === 'admin' ? 'এডমিন' : 'ড্যাশবোর্ড'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <nav className={`bg-white border-b ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row md:justify-center gap-4 md:gap-8 py-3 font-serif font-medium text-gray-700">
            <li className="cursor-pointer hover:text-brand-red" onClick={() => onNavigate('home')}>প্রচ্ছদ</li>
            {categories.map(cat => (
              <li 
                key={cat.id} 
                className="relative group cursor-pointer"
                onMouseEnter={() => setActiveDropdown(cat.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div 
                  className="flex items-center gap-1 hover:text-brand-red"
                  onClick={() => {
                    onCategoryClick(cat.slug);
                    setIsMenuOpen(false);
                  }}
                >
                  {cat.name}
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </div>

                {/* Sub-menu Dropdown */}
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <div className={`
                    md:absolute md:top-full md:left-0 md:bg-white md:shadow-lg md:border md:min-w-[150px] md:z-50
                    ${activeDropdown === cat.id ? 'block' : 'hidden'}
                    ${isMenuOpen ? 'pl-4 mt-2 border-l-2 border-brand-red block static shadow-none border-none' : ''}
                  `}>
                    <ul className="py-2 text-sm text-gray-600">
                      {cat.subCategories.map(sub => (
                         <li 
                           key={sub.id} 
                           className="px-4 py-2 hover:bg-gray-100 hover:text-brand-red transition"
                           onClick={(e) => {
                             e.stopPropagation();
                             onCategoryClick(sub.slug);
                             setIsMenuOpen(false);
                           }}
                         >
                           {sub.name}
                         </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black text-white pt-12 pb-6 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-serif font-bold mb-4 text-brand-red">প্রাণের মাতাজীহাট</h2>
          <p className="text-gray-400 text-sm leading-relaxed font-sans">
            সত্যের সন্ধানে সর্বদা। মাতাজীহাটের অন্যতম জনপ্রিয় অনলাইন নিউজ পোর্টাল। আমরা সবার আগে সঠিক সংবাদ পৌঁছে দিতে বদ্ধপরিকর।
          </p>
          <div className="flex gap-4 mt-6">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-500" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-blue-400" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-500" />
            <Youtube className="w-5 h-5 cursor-pointer hover:text-red-600" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">জনপ্রিয় বিভাগ</h3>
          <ul className="space-y-2 text-sm text-gray-400 font-sans">
            <li className="hover:text-white cursor-pointer">বাংলাদেশ</li>
            <li className="hover:text-white cursor-pointer">আন্তর্জাতিক</li>
            <li className="hover:text-white cursor-pointer">খেলাধুলা</li>
            <li className="hover:text-white cursor-pointer">বিনোদন</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">যোগাযোগ</h3>
          <ul className="space-y-2 text-sm text-gray-400 font-sans">
            <li>ইমেইল: editor@pranermatajihat.com</li>
            <li>ফোন: +৮৮০ ১২৩৪ ৫৬৭৮৯০</li>
            <li>ঠিকানা: মাতাজীহাট, নওগাঁ</li>
          </ul>
        </div>

        <div>
           <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">মোবাইল অ্যাপ</h3>
           <div className="bg-gray-800 h-32 flex items-center justify-center rounded text-gray-500 text-xs">
             App Store Links Here
           </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm font-sans">
        &copy; {new Date().getFullYear()} প্রাণের মাতাজীহাট | সর্বস্বত্ব সংরক্ষিত
      </div>
    </footer>
  );
};

interface SidebarProps {
  news: NewsItem[];
  onNewsClick: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ news, onNewsClick }) => {
  const mostViewed = [...news].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Most Viewed */}
      <div className="bg-white p-4 border rounded-sm">
        <h3 className="text-xl font-serif font-bold mb-4 border-l-4 border-brand-red pl-3 text-gray-800">
          সর্বাধিক পঠিত
        </h3>
        <div className="space-y-4">
          {mostViewed.map((item, idx) => (
            <div key={item.id} className="flex gap-3 cursor-pointer group" onClick={() => onNewsClick(item.id)}>
              <span className="text-3xl font-bold text-gray-200 group-hover:text-brand-red transition">{idx + 1}</span>
              <div>
                <h4 className="text-sm font-medium font-serif leading-tight group-hover:text-brand-red transition">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Space */}
      <div className="bg-gray-100 h-64 flex items-center justify-center text-gray-400 text-sm border">
        বিজ্ঞাপন
      </div>
    </div>
  );
};

export const BreakingNewsTicker: React.FC<{ news: NewsItem[] }> = ({ news }) => {
  const breaking = news.filter(n => n.isBreaking);
  if (breaking.length === 0) return null;

  return (
    <div className="bg-brand-red text-white text-sm flex">
      <div className="bg-brand-dark px-4 py-2 font-bold whitespace-nowrap z-10">
        ব্রেকিং নিউজ
      </div>
      <div className="overflow-hidden flex items-center w-full relative">
        <div className="animate-marquee whitespace-nowrap flex gap-8 pl-4">
          {breaking.map(item => (
            <span key={item.id} className="inline-block mx-4 font-sans">• {item.title}</span>
          ))}
        </div>
      </div>
    </div>
  );
};