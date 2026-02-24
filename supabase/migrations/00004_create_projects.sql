CREATE TYPE project_status_enum AS ENUM (
  'designing',
  'constructing',
  'completed',
  'awarded'
);

CREATE TYPE publish_status_enum AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TABLE projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh          TEXT NOT NULL,
  title_en          TEXT,
  slug              TEXT NOT NULL UNIQUE,
  cover_url         TEXT,
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  location          TEXT,
  area              TEXT,
  year              INT,
  materials_zh      TEXT,
  materials_en      TEXT,
  project_status    project_status_enum DEFAULT 'designing',
  description_zh    TEXT,
  description_en    TEXT,
  seo_title_zh      TEXT,
  seo_title_en      TEXT,
  seo_description_zh TEXT,
  seo_description_en TEXT,
  og_image_url      TEXT,
  sort_order        INT NOT NULL DEFAULT 0,
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  publish_status    publish_status_enum NOT NULL DEFAULT 'draft',
  preview_token     TEXT,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_publish_status ON projects(publish_status);
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_featured ON projects(is_featured, sort_order)
  WHERE publish_status = 'published';
CREATE INDEX idx_projects_sort ON projects(sort_order);
CREATE INDEX idx_projects_slug ON projects(slug);

CREATE TRIGGER trigger_projects_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
