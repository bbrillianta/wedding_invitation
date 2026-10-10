-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rsvp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestId" TEXT NOT NULL,
    "attendance" TEXT,
    "numberOfGuests" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rsvp_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rsvp" ("attendance", "createdAt", "guestId", "id", "numberOfGuests", "updatedAt") SELECT "attendance", "createdAt", "guestId", "id", "numberOfGuests", "updatedAt" FROM "Rsvp";
DROP TABLE "Rsvp";
ALTER TABLE "new_Rsvp" RENAME TO "Rsvp";
CREATE UNIQUE INDEX "Rsvp_guestId_key" ON "Rsvp"("guestId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

