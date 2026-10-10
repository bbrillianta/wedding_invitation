-- Removal: party size is one site-wide cap (MAX_PARTY_SIZE in lib/guests.ts),
-- not per guest. Apply after the code that stops reading it is live.
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "groupLabel" TEXT,
    "side" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "viewedAt" DATETIME,
    "checkedInAt" DATETIME,
    "vehicle" TEXT,
    "arrivedGuestCount" INTEGER
);
INSERT INTO "new_Guest" ("arrivedGuestCount", "checkedInAt", "code", "createdAt", "groupLabel", "id", "name", "side", "updatedAt", "vehicle", "viewedAt") SELECT "arrivedGuestCount", "checkedInAt", "code", "createdAt", "groupLabel", "id", "name", "side", "updatedAt", "vehicle", "viewedAt" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_code_key" ON "Guest"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

