-- Additive: which guests are also invited to the Akad. Apply before pushing
-- the code that reads it.
ALTER TABLE "Guest" ADD COLUMN "akad" BOOLEAN NOT NULL DEFAULT false;
