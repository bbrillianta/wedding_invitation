-- Additive half of the move to /?id=<code> links: apply before pushing the
-- code that reads it. Left nullable here so the deployment still running
-- (which creates ?name= guests without a code) keeps working; the follow-up
-- drop_guest_slug migration makes it required.
ALTER TABLE "Guest" ADD COLUMN "code" TEXT;

-- Existing rows get a random 8-character code.
UPDATE "Guest" SET "code" = lower(hex(randomblob(4))) WHERE "code" IS NULL;

CREATE UNIQUE INDEX "Guest_code_key" ON "Guest"("code");
