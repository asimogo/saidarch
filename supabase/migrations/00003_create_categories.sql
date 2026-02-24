CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_zh     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  name_km     TEXT,
  slug        TEXT NOT NULL UNIQUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_sort ON categories(sort_order);

CREATE TRIGGER trigger_categories_updated
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
