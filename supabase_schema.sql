-- 🛡️ HEXTECH TRIVIA DATABASE SCHEMA
-- Run this in the Supabase SQL Editor

-- 1. Create Profiles Table (Sync with Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Quizzes Table
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  time TEXT,
  plays INTEGER DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  questions JSONB NOT NULL, -- Stores the array of questions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Leaderboards Table
CREATE TABLE leaderboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  rank TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Simple for now: Anyone can read, Auth users can write)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public quizzes are viewable by everyone" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Leaderboards are viewable by everyone" ON leaderboards FOR SELECT USING (true);

-- Auth users can manage their own trials
CREATE POLICY "Users can insert their own quizzes" ON quizzes FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own quizzes" ON quizzes FOR UPDATE USING (auth.uid() = author_id);

-- Everyone can insert scores (but verified profiles linked)
CREATE POLICY "Users can insert leaderboard entries" ON leaderboards FOR INSERT WITH CHECK (auth.uid() = user_id);
