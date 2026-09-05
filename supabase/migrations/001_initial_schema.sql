-- ============================================================
-- ClaimAppeal AI — Initial Database Schema
-- Run against your Supabase project's SQL editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- APPEALS (main entity)
-- ============================================================
CREATE TABLE public.appeals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Untitled Appeal',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_progress', 'generated', 'submitted', 'approved', 'denied')),
  supporting_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appeals_profile_id ON public.appeals(profile_id);
CREATE INDEX idx_appeals_status ON public.appeals(status);

-- ============================================================
-- INSURANCE INFORMATION (1:1 with appeal)
-- ============================================================
CREATE TABLE public.insurance_information (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appeal_id UUID NOT NULL UNIQUE REFERENCES public.appeals(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  plan_type TEXT,
  member_id TEXT,
  group_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CLAIM INFORMATION (1:1 with appeal)
-- ============================================================
CREATE TABLE public.claim_information (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appeal_id UUID NOT NULL UNIQUE REFERENCES public.appeals(id) ON DELETE CASCADE,
  claim_number TEXT,
  date_of_service DATE,
  provider_name TEXT,
  provider_npi TEXT,
  cpt_codes TEXT[] DEFAULT '{}',
  diagnosis_codes TEXT[] DEFAULT '{}',
  amount_billed NUMERIC(12, 2),
  amount_denied NUMERIC(12, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DENIAL INFORMATION (1:1 with appeal)
-- ============================================================
CREATE TABLE public.denial_information (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appeal_id UUID NOT NULL UNIQUE REFERENCES public.appeals(id) ON DELETE CASCADE,
  denial_reason TEXT NOT NULL,
  denial_code TEXT,
  denial_description TEXT,
  denial_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- APPEAL VERSIONS (versioned generations)
-- ============================================================
CREATE TABLE public.appeal_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appeal_id UUID NOT NULL REFERENCES public.appeals(id) ON DELETE CASCADE,
  version_number INT NOT NULL DEFAULT 1,
  structured_output JSONB,
  edited_content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(appeal_id, version_number)
);

CREATE INDEX idx_appeal_versions_appeal_id ON public.appeal_versions(appeal_id);

-- ============================================================
-- GENERATED DOCUMENTS (PDF metadata + storage path)
-- ============================================================
CREATE TABLE public.generated_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appeal_version_id UUID REFERENCES public.appeal_versions(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS (Stripe subscription state mirror)
-- ============================================================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'pro', 'business')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_stripe_sub ON public.subscriptions(stripe_subscription_id);

-- ============================================================
-- USAGE RECORDS (per-period generation counts)
-- ============================================================
CREATE TABLE public.usage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  generation_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_records_profile_period ON public.usage_records(profile_id, period_start, period_end);

-- ============================================================
-- AI GENERATIONS (cost/perf tracking per call)
-- ============================================================
CREATE TABLE public.ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appeal_version_id UUID REFERENCES public.appeal_versions(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  duration_ms INT,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  error_code TEXT,
  estimated_cost_usd NUMERIC(8, 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_profile ON public.audit_logs(profile_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);

-- ============================================================
-- REFERENCE DOCUMENTS (trusted citations for AI)
-- ============================================================
CREATE TABLE public.reference_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — enforce on every user-data table
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.denial_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_documents ENABLE ROW LEVEL SECURITY;

-- Profiles: users see only their own
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Appeals: users see only their own
CREATE POLICY "appeals_select_own" ON public.appeals
  FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "appeals_insert_own" ON public.appeals
  FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "appeals_update_own" ON public.appeals
  FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "appeals_delete_own" ON public.appeals
  FOR DELETE USING (auth.uid() = profile_id);

-- Insurance info: via appeal ownership
CREATE POLICY "insurance_select_via_appeal" ON public.insurance_information
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );
CREATE POLICY "insurance_insert_via_appeal" ON public.insurance_information
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );
CREATE POLICY "insurance_update_via_appeal" ON public.insurance_information
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );

-- Claim info: via appeal ownership
CREATE POLICY "claim_select_via_appeal" ON public.claim_information
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );
CREATE POLICY "claim_insert_via_appeal" ON public.claim_information
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );
CREATE POLICY "claim_update_via_appeal" ON public.claim_information
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );

-- Denial info: via appeal ownership
CREATE POLICY "denial_select_via_appeal" ON public.denial_information
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );
CREATE POLICY "denial_insert_via_appeal" ON public.denial_information
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );
CREATE POLICY "denial_update_via_appeal" ON public.denial_information
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );

-- Appeal versions: via appeal ownership
CREATE POLICY "versions_select_via_appeal" ON public.appeal_versions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );
CREATE POLICY "versions_insert_via_appeal" ON public.appeal_versions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.appeals WHERE appeals.id = appeal_id AND appeals.profile_id = auth.uid())
  );

-- Generated documents: via appeal version → appeal ownership
CREATE POLICY "docs_select_via_version" ON public.generated_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appeal_versions av
      JOIN public.appeals a ON a.id = av.appeal_id
      WHERE av.id = appeal_version_id AND a.profile_id = auth.uid()
    )
  );
CREATE POLICY "docs_insert_via_version" ON public.generated_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.appeal_versions av
      JOIN public.appeals a ON a.id = av.appeal_id
      WHERE av.id = appeal_version_id AND a.profile_id = auth.uid()
    )
  );

-- Subscriptions: users see only their own
CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = profile_id);

-- Usage records: users see only their own
CREATE POLICY "usage_select_own" ON public.usage_records
  FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "usage_insert_own" ON public.usage_records
  FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "usage_update_own" ON public.usage_records
  FOR UPDATE USING (auth.uid() = profile_id);

-- AI generations: read-only via version → appeal ownership
CREATE POLICY "ai_gen_select_via_version" ON public.ai_generations
  FOR SELECT USING (
    appeal_version_id IS NULL OR EXISTS (
      SELECT 1 FROM public.appeal_versions av
      JOIN public.appeals a ON a.id = av.appeal_id
      WHERE av.id = appeal_version_id AND a.profile_id = auth.uid()
    )
  );

-- Audit logs: users see only their own
CREATE POLICY "audit_select_own" ON public.audit_logs
  FOR SELECT USING (auth.uid() = profile_id);

-- Reference documents: readable by all authenticated users
CREATE POLICY "refs_select_authenticated" ON public.reference_documents
  FOR SELECT USING (auth.role() = 'authenticated');
