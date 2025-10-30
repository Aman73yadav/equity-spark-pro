-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty TEXT,
  avatar_url TEXT,
  rating DECIMAL(2,1) DEFAULT 5.0,
  total_deals INTEGER DEFAULT 0,
  active_listings INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_feet INTEGER,
  property_type TEXT,
  status TEXT DEFAULT 'available',
  agent_id UUID REFERENCES public.agents(id),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Agents policies (public read)
CREATE POLICY "Anyone can view agents" ON public.agents FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert agents" ON public.agents FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Properties policies (public read)
CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage properties" ON public.properties FOR ALL USING (auth.role() = 'authenticated');

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Chat messages policies
CREATE POLICY "Users can view own messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample agent data
INSERT INTO public.agents (name, email, phone, specialty, rating, total_deals, active_listings, status) VALUES
('Aman Choudhary', 'amanchotu109@gmail.com', '+917484822872', 'Residential Properties', 4.9, 45, 12, 'available'),
('Sarah Johnson', 'sarah.j@dreamequity.com', '+1-555-0102', 'Commercial Real Estate', 4.8, 38, 8, 'available'),
('Michael Chen', 'michael.c@dreamequity.com', '+1-555-0103', 'Luxury Homes', 5.0, 52, 15, 'available'),
('Priya Sharma', 'priya.s@dreamequity.com', '+91-9876543210', 'Investment Properties', 4.7, 41, 10, 'busy'),
('David Martinez', 'david.m@dreamequity.com', '+1-555-0105', 'Land Development', 4.9, 33, 6, 'available');

-- Insert sample property data
INSERT INTO public.properties (title, description, price, address, latitude, longitude, bedrooms, bathrooms, square_feet, property_type, agent_id, status) VALUES
('Modern Downtown Apartment', 'Stunning 3BR apartment with city views', 450000, '123 Main St, Mumbai, India', 19.0760, 72.8777, 3, 2, 1500, 'apartment', (SELECT id FROM agents WHERE email = 'amanchotu109@gmail.com' LIMIT 1), 'available'),
('Luxury Villa with Pool', 'Spacious 5BR villa in prime location', 1200000, '456 Palm Avenue, Goa, India', 15.2993, 74.1240, 5, 4, 3500, 'villa', (SELECT id FROM agents WHERE email = 'amanchotu109@gmail.com' LIMIT 1), 'available'),
('Commercial Office Space', 'Prime office space in business district', 850000, '789 Business Park, Bangalore, India', 12.9716, 77.5946, 0, 3, 2500, 'commercial', (SELECT id FROM agents WHERE email = 'sarah.j@dreamequity.com' LIMIT 1), 'available'),
('Beachfront Property', 'Exclusive beachfront villa with private access', 2500000, '321 Coastal Road, Kerala, India', 8.5241, 76.9366, 4, 3, 4000, 'villa', (SELECT id FROM agents WHERE email = 'michael.c@dreamequity.com' LIMIT 1), 'available'),
('Investment Land Plot', '5-acre land suitable for development', 600000, 'Highway 45, Pune, India', 18.5204, 73.8567, 0, 0, 217800, 'land', (SELECT id FROM agents WHERE email = 'priya.s@dreamequity.com' LIMIT 1), 'available'),
('Penthouse Suite', 'Ultra-luxury penthouse with panoramic views', 3200000, '100 Skyline Tower, Delhi, India', 28.6139, 77.2090, 4, 4, 5000, 'penthouse', (SELECT id FROM agents WHERE email = 'michael.c@dreamequity.com' LIMIT 1), 'available');

-- Enable realtime for notifications and chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;