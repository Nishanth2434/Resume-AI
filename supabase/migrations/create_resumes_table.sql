-- Migration to create resumes table for saving builder data

CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only select their own resume
CREATE POLICY "Users can view their own resume" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert/update their own resume
CREATE POLICY "Users can insert/update their own resume" ON public.resumes
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

