-- v392 Migration UID duplicate guard
-- A Game UID may have at most one non-deleted migration application, regardless of application status.
-- Soft-deleted records are intentionally excluded so an administrator can explicitly clear a record for re-application.

CREATE TRIGGER IF NOT EXISTS trg_migration_applications_uid_unique_insert
BEFORE INSERT ON migration_applications
WHEN NEW.deleted_at IS NULL
 AND EXISTS (
   SELECT 1 FROM migration_applications
   WHERE game_uid = NEW.game_uid
     AND deleted_at IS NULL
 )
BEGIN
  SELECT RAISE(ABORT, 'MIGRATION_APPLICATION_EXISTS');
END;

CREATE TRIGGER IF NOT EXISTS trg_migration_applications_uid_unique_update
BEFORE UPDATE OF game_uid, deleted_at ON migration_applications
WHEN NEW.deleted_at IS NULL
 AND EXISTS (
   SELECT 1 FROM migration_applications
   WHERE game_uid = NEW.game_uid
     AND deleted_at IS NULL
     AND id <> OLD.id
 )
BEGIN
  SELECT RAISE(ABORT, 'MIGRATION_APPLICATION_EXISTS');
END;
