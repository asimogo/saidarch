CREATE TYPE section_type_enum AS ENUM (
  'project',
  'brand',
  'about',
  'contact',
  'hero',
  'general'
);

CREATE TABLE translation_prompts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type  section_type_enum NOT NULL UNIQUE,
  prompt_text   TEXT NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_translation_prompts_updated
  BEFORE UPDATE ON translation_prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
