-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Profiles Table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  role text default 'user' check (role in ('user', 'admin', 'sub-admin')),
  avatar text,
  bio text,
  joined_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete set null
);

-- Enable RLS for Categories
alter table public.categories enable row level security;

create policy "Categories are viewable by everyone."
  on categories for select
  using ( true );

create policy "Only admins can insert categories."
  on categories for insert
  with check ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

create policy "Only admins can update categories."
  on categories for update
  using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

create policy "Only admins can delete categories."
  on categories for delete
  using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

-- Create News Table
create table public.news (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  short_description text,
  full_description text,
  category_slug text references public.categories(slug) on delete set null, -- simplified relation via slug or could use ID
  image_url text,
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamp with time zone default timezone('utc'::text, now()),
  views integer default 0,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  tags text[],
  is_breaking boolean default false
);

-- Enable RLS for News
alter table public.news enable row level security;

create policy "Approved news is viewable by everyone."
  on news for select
  using ( status = 'approved' );

create policy "Users can see their own pending news."
  on news for select
  using ( auth.uid() = author_id );

create policy "Admins can see all news."
  on news for select
  using ( exists ( select 1 from profiles where id = auth.uid() and role in ('admin', 'sub-admin') ) );

create policy "Users can insert news."
  on news for insert
  with check ( auth.uid() = author_id );

create policy "Users can update their own news."
  on news for update
  using ( auth.uid() = author_id );

create policy "Admins can update any news."
  on news for update
  using ( exists ( select 1 from profiles where id = auth.uid() and role in ('admin', 'sub-admin') ) );

create policy "Admins can delete news."
  on news for delete
  using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

-- Create Site Settings Table
create table public.site_settings (
  id integer primary key default 1,
  area_title text,
  area_description text,
  slider_images text[],
  constraint single_row check (id = 1)
);

-- Insert Default Settings
insert into public.site_settings (id, area_title, area_description, slider_images)
values (1, 'মাতাজীহাট', 'মাতাজীহাট একটি সমৃদ্ধ ও ঐতিহ্যবাহী জনপদ।', ARRAY['https://images.unsplash.com/photo-1589330273594-fade1ee91647?q=80&w=1200&auto=format&fit=crop']);

-- Enable RLS for Settings
alter table public.site_settings enable row level security;

create policy "Settings are viewable by everyone."
  on site_settings for select
  using ( true );

create policy "Only admins can update settings."
  on site_settings for update
  using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, avatar)
  values (new.id, new.email, new.raw_user_meta_data->>'name', 'user', new.raw_user_meta_data->>'avatar');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert Initial Categories
insert into public.categories (name, slug) values 
('বাংলাদেশ', 'bangladesh'),
('আন্তর্জাতিক', 'international'),
('খেলা', 'sports'),
('বিনোদন', 'entertainment'),
('প্রযুক্তি', 'technology'),
('অর্থনীতি', 'economy');
