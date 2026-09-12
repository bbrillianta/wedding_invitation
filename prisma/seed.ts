import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { guests } from "../lib/guests-data";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const guest of guests) {
    await prisma.guest.upsert({
      where: { slug: guest.slug },
      update: {
        name: guest.name,
        groupLabel: guest.groupLabel,
        invitedGuestCount: guest.invitedGuestCount,
      },
      create: {
        slug: guest.slug,
        name: guest.name,
        groupLabel: guest.groupLabel,
        invitedGuestCount: guest.invitedGuestCount,
      },
    });
  }

  console.log(`Seeded ${guests.length} guests from lib/guests-data.ts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
