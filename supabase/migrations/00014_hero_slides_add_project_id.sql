ALTER TABLE hero_slides
  ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
