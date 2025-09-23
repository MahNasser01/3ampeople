-- Create enum type for plan
CREATE TYPE plan AS ENUM ('free', 'pro', 'free_trial_over');

-- Create tables
CREATE TABLE organization (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    name TEXT,
    image_url TEXT,
    allowed_responses_count INTEGER,
    plan plan
);

CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    email TEXT,
    organization_id TEXT REFERENCES organization(id)
);

CREATE TABLE interviewer (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    agent_id TEXT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    audio TEXT,
    empathy INTEGER NOT NULL,
    exploration INTEGER NOT NULL,
    rapport INTEGER NOT NULL,
    speed INTEGER NOT NULL
);

CREATE TABLE interview (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

    -- Originals
    name TEXT,
    description TEXT,
    objective TEXT,
    organization_id TEXT REFERENCES organization(id),
    user_id TEXT REFERENCES "user"(id),
    interviewer_id INTEGER REFERENCES interviewer(id),
    is_active BOOLEAN DEFAULT true,
    is_anonymous BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    logo_url TEXT,
    theme_color TEXT,
    url TEXT,
    readable_slug TEXT,
    questions JSONB,
    quotes JSONB[],
    insights TEXT[],
    respondents TEXT[],
    question_count INTEGER,
    response_count INTEGER,
    time_duration TEXT,
    jd TEXT
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS interview_org_arch_idx
  ON interview (organization_id, is_archived);

CREATE INDEX IF NOT EXISTS interview_slug_idx
  ON interview (readable_slug);

-- JSONB GIN indexes for fast filtering
CREATE INDEX IF NOT EXISTS interview_questions_gin_idx
  ON interview USING GIN (questions);

CREATE INDEX IF NOT EXISTS interview_question_summaries_gin_idx
  ON interview USING GIN (question_summaries);

CREATE INDEX IF NOT EXISTS interview_insights_json_gin_idx
  ON interview USING GIN (insights_json);

CREATE INDEX IF NOT EXISTS interview_sparc_gin_idx
  ON interview USING GIN (sparc_breakdown);

-- New table: candidate-specific tailoring for interviews
CREATE TABLE public.interview_candidate (
  id TEXT PRIMARY KEY,                         -- uuid or cuid
  interview_id TEXT NOT NULL REFERENCES public.interview(id) ON DELETE CASCADE,

  -- Candidate identification (email is required here)
  candidate_email TEXT NOT NULL,

  -- Optional metadata
  candidate_name TEXT,
  cv_ref TEXT,                                 -- pointer to CV (file/url/id)

  -- Tailored questions generated from JD + CV
  tailored_questions JSONB,                    -- [{question:"..."}, ...]

  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS interview_candidate_interview_idx
  ON public.interview_candidate (interview_id);

CREATE INDEX IF NOT EXISTS interview_candidate_email_idx
  ON public.interview_candidate (candidate_email);


CREATE TABLE response (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    interview_id TEXT REFERENCES interview(id),
    name TEXT,
    email TEXT,
    call_id TEXT,
    candidate_status TEXT,
    duration INTEGER,
    details JSONB,
    analytics JSONB,
    is_analysed BOOLEAN DEFAULT false,
    is_ended BOOLEAN DEFAULT false,
    is_viewed BOOLEAN DEFAULT false,
    tab_switch_count INTEGER
);

CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    interview_id TEXT REFERENCES interview(id),
    email TEXT,
    feedback TEXT,
    satisfaction INTEGER
);


-- Applications table for candidate submissions
CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    job_position TEXT,
    cover_letter TEXT,
    resume_url TEXT NOT NULL,
    parsed_resume JSONB,
    analyzed_resume JSONB,
    resume_score NUMERIC,
    interview_id TEXT REFERENCES interview(id)

-- Stores uploaded candidate recording metadata for cheat detection
CREATE TABLE cheat_file (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    interview_id TEXT REFERENCES interview(id),
    call_id TEXT,
    email TEXT,
    name TEXT,
    file_path TEXT,
    mime_type TEXT,
    status TEXT DEFAULT 'uploaded',
    processed_at TIMESTAMP WITH TIME ZONE,
    result JSONB

);
