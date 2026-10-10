-- Removal half of the move to /?id=<code> links: apply only after the
-- deployment that no longer reads slug/isGeneric is live. Makes code required
-- and drops the name-derived slug and the ?name= flag.
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "groupLabel" TEXT,
    "invitedGuestCount" INTEGER NOT NULL DEFAULT 1,
    "side" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "viewedAt" DATETIME,
    "checkedInAt" DATETIME,
    "vehicle" TEXT,
    "arrivedGuestCount" INTEGER
);
INSERT INTO "new_Guest" ("arrivedGuestCount", "checkedInAt", "code", "createdAt", "groupLabel", "id", "invitedGuestCount", "name", "side", "updatedAt", "vehicle", "viewedAt") SELECT "arrivedGuestCount", "checkedInAt", "code", "createdAt", "groupLabel", "id", "invitedGuestCount", "name", "side", "updatedAt", "vehicle", "viewedAt" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_code_key" ON "Guest"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

