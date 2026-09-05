-- ============================================================
-- Seed: Trusted Reference Documents
-- Manually verified, general appeal-rights language.
-- NEVER LLM-invented. All facts verified by human.
-- ============================================================

INSERT INTO public.reference_documents (title, content, category, active) VALUES

-- ERISA / Federal Rights
(
  'ERISA Appeal Rights — Internal Appeal',
  'Under the Employee Retirement Income Security Act (ERISA), group health plan members have the right to appeal a denied claim. The plan must provide a full and fair review of the denial. Members must generally file an internal appeal within 180 days of receiving the denial notice. The plan must decide on the appeal within 30 days for pre-service claims, 72 hours for urgent care claims, and 60 days for post-service claims.',
  'federal_rights',
  TRUE
),
(
  'ERISA Appeal Rights — External Review',
  'After exhausting internal appeals, ERISA plan members have the right to an independent external review. This right applies to all non-grandfathered group health plans. The external review must be conducted by an independent review organization (IRO) not affiliated with the health plan. Federal external review applies when state external review processes do not meet minimum consumer protections.',
  'federal_rights',
  TRUE
),

-- ACA / Affordable Care Act
(
  'ACA — Denial Notice Requirements',
  'Under the Affordable Care Act (ACA), health plans must provide clear written notice explaining the reason for a claim denial, including the specific plan terms or clinical rationale relied upon. The notice must describe the internal appeal process, timelines, and the member''s right to external review. Plans must also inform members of their right to request the clinical criteria used in the decision.',
  'federal_rights',
  TRUE
),
(
  'ACA — Medical Necessity Denials',
  'When a claim is denied based on medical necessity, the plan must explain why the service was not considered medically necessary. Members can request the specific clinical criteria, guidelines, or protocols used to make the determination. Plans cannot use proprietary criteria that are not disclosed to the member upon request.',
  'medical_necessity',
  TRUE
),

-- General Appeal Guidance
(
  'General Appeal Strategy — Supporting Documentation',
  'An effective appeal typically includes: (1) a clear statement identifying the denied claim by number, date, and service; (2) the specific reason the denial should be overturned; (3) supporting medical records or documentation from the treating physician; (4) relevant clinical guidelines or peer-reviewed evidence supporting the medical necessity of the service; (5) a letter of medical necessity from the prescribing or treating provider. Always reference specific plan terms and ask for a written response.',
  'appeal_strategy',
  TRUE
),
(
  'General Appeal Strategy — Timelines',
  'Most insurance plans require appeals to be filed within 180 days of the denial notice, though some plans have shorter windows (e.g., 60 or 90 days). Always check the denial letter for the specific deadline. Missing the appeal deadline may forfeit the right to appeal. Urgent or pre-service appeals typically have shorter processing timelines (72 hours for urgent, 30 days for pre-service, 60 days for post-service).',
  'appeal_strategy',
  TRUE
);
