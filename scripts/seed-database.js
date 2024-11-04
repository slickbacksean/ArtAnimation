// Save as: scripts/seed-database.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Seed users
    await prisma.user.createMany({
      data: [
        { email: 'user1@example.com', name: 'User One' },
        { email: 'user2@example.com', name: 'User Two' },
      ],
    });

    // Seed projects
    await prisma.project.createMany({
      data: [
        { name: 'Project 1', userId: 1 },
        { name: 'Project 2', userId: 2 },
      ],
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();