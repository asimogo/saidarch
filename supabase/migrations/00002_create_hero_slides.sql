CREATE TABLE hero_slides (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url     TEXT NOT NULL,
  title_zh      TEXT,
  title_en      TEXT,
  subtitle_zh   TEXT,
  subtitle_en   TEXT,
  cta_text_zh   TEXT DEFAULT '查看作品',
  cta_text_en   TEXT DEFAULT 'View Projects',
  cta_link      TEXT DEFAULT '/projects',
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hero_slides_active_sort ON hero_slides(is_active, sort_order);

CREATE TRIGGER trigger_hero_slides_updated
  BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
