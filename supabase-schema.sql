-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nickname TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    email_confirmed BOOLEAN DEFAULT FALSE,
    reset_token TEXT,
    reset_token_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_usage table
CREATE TABLE IF NOT EXISTS public.app_usage (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id),
    app_id TEXT NOT NULL,
    usage_time INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_config table
CREATE TABLE IF NOT EXISTS public.app_config (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id),
    app_id TEXT NOT NULL,
    threshold_minutes INTEGER DEFAULT 60,
    notification_level TEXT DEFAULT 'standard',
    custom_messages JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, app_id)
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) UNIQUE,
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TEXT DEFAULT '22:00',
    quiet_hours_end TEXT DEFAULT '07:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create demo user for testing
INSERT INTO public.users (nickname, password, email, email_confirmed)
VALUES ('demo', 'password123', 'demo@example.com', TRUE)
ON CONFLICT (email) DO NOTHING;
