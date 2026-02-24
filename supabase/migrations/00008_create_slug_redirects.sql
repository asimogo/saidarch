CREATE TABLE slug_redirects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  old_slug   TEXT NOT NULL UNIQUE,
  new_slug   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_slug_redirects_old ON slug_redirects(old_slug);
