CREATE TABLE page_contents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  title_zh    TEXT,
  title_en    TEXT,
  content_zh  TEXT,
  content_en  TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_page_contents_updated
  BEFORE UPDATE ON page_contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
