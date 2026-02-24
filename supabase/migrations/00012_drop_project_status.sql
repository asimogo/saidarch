-- Remove project_status column from projects table
ALTER TABLE projects DROP COLUMN IF EXISTS project_status;

-- Drop the enum type
DROP TYPE IF EXISTS project_status_enum;
