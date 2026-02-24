CREATE TABLE project_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  caption_zh  TEXT,
  caption_en  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_images_project ON project_images(project_id, sort_order);
