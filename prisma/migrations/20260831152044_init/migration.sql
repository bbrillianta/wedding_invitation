-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "groupLabel" TEXT,
    "invitedGuestCount" INTEGER NOT NULL DEFAULT 1,
    "side" TEXT,
    "isGeneric" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "viewedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Rsvp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestId" TEXT NOT NULL,
    "attendance" TEXT,
    "numberOfGuests" INTEGER NOT NULL DEFAULT 1,
    "mealPreference" TEXT NOT NULL DEFAULT 'NO_PREFERENCE',
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rsvp_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_slug_key" ON "Guest"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Rsvp_guestId_key" ON "Rsvp"("guestId");
