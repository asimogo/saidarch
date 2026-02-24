-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE slug_redirects ENABLE ROW LEVEL SECURITY;

-- === Anonymous user (frontend) policies ===

CREATE POLICY "anon_read_settings" ON site_settings
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_active_slides" ON hero_slides
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "anon_read_categories" ON categories
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_published_projects" ON projects
  FOR SELECT TO anon USING (publish_status = 'published');

CREATE POLICY "anon_read_project_images" ON project_images
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_images.project_id
      AND projects.publish_status = 'published'
    )
  );

CREATE POLICY "anon_read_pages" ON page_contents
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_redirects" ON slug_redirects
  FOR SELECT TO anon USING (true);

-- === Authenticated user (admin) policies ===

CREATE POLICY "auth_full_access_settings" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_slides" ON hero_slides
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_categories" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_images" ON project_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_prompts" ON translation_prompts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_pages" ON page_contents
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_redirects" ON slug_redirects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
