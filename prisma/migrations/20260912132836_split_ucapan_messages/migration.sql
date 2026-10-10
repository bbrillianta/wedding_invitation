-- CreateTable
CREATE TABLE "UcapanMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UcapanMessage_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Carry forward each guest's existing single Ucapan & Doa message (from
-- the old Rsvp.message column) as their first row in the new table, so
-- switching to a one-to-many model doesn't lose anything already
-- submitted.
INSERT INTO "UcapanMessage" ("id", "guestId", "message", "createdAt")
SELECT lower(hex(randomblob(16))), "guestId", "message", "createdAt"
FROM "Rsvp"
WHERE "message" IS NOT NULL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rsvp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestId" TEXT NOT NULL,
    "attendance" TEXT,
    "numberOfGuests" INTEGER NOT NULL DEFAULT 1,
    "mealPreference" TEXT NOT NULL DEFAULT 'NO_PREFERENCE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rsvp_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rsvp" ("attendance", "createdAt", "guestId", "id", "mealPreference", "numberOfGuests", "updatedAt") SELECT "attendance", "createdAt", "guestId", "id", "mealPreference", "numberOfGuests", "updatedAt" FROM "Rsvp";
DROP TABLE "Rsvp";
ALTER TABLE "new_Rsvp" RENAME TO "Rsvp";
CREATE UNIQUE INDEX "Rsvp_guestId_key" ON "Rsvp"("guestId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "UcapanMessage_guestId_idx" ON "UcapanMessage"("guestId");
