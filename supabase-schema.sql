-- Supabase Schema for Android App Usage Monitor

-- User Profiles Table - Stores user nicknames
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add RLS policies for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- App Usage Table - Stores usage data for each app
CREATE TABLE app_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,  -- Package name of the app (e.g., "com.instagram.android")
  usage_time INTEGER NOT NULL,  -- Usage time in minutes
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE app_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own app usage data"
  ON app_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own app usage data"
  ON app_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- App Configuration Table - Stores settings for each monitored app
CREATE TABLE app_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,  -- Package name of the app
  app_name TEXT NOT NULL,  -- Human-readable name
  app_icon TEXT,  -- URL to app icon
  threshold INTEGER NOT NULL DEFAULT 60,  -- Time limit in minutes
  notification_level TEXT NOT NULL DEFAULT 'standard',  -- standard, persistent, full-screen
  custom_messages JSONB,  -- Array of custom notification messages
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- Add RLS policies
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own app configs"
  ON app_config FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own app configs"
  ON app_config FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own app configs"
  ON app_config FOR UPDATE
  USING (auth.uid() = user_id);

-- User Settings Table - Stores global app settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX user_profiles_user_id_idx ON user_profiles(user_id);
CREATE INDEX app_usage_user_id_idx ON app_usage(user_id);
CREATE INDEX app_usage_timestamp_idx ON app_usage(timestamp);
CREATE INDEX app_config_user_id_idx ON app_config(user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ language 'plpgsql';

-- Add triggers to update the updated_at column
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_config_updated_at
BEFORE UPDATE ON app_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
