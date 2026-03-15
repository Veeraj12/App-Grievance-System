const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with test users...");

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Delete existing test users first
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["admin@test.com", "staff@test.com", "user@test.com"],
        },
      },
    });

    // Create test users with different roles
    const users = [
      {
        name: "Admin User",
        email: "admin@test.com",
        password: hashedPassword,
        role: "ADMIN",
      },
      {
        name: "Staff User",
        email: "staff@test.com",
        password: hashedPassword,
        role: "STAFF",
      },
      {
        name: "Regular User",
        email: "user@test.com",
        password: hashedPassword,
        role: "USER",
      },
    ];

    for (const userData of users) {
      const user = await prisma.user.create({
        data: userData,
      });
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }

    console.log("\n✅ Database seeded successfully!");
    console.log("\nTest credentials:");
    console.log("Admin: admin@test.com / password123");
    console.log("Staff: staff@test.com / password123");
    console.log("User: user@test.com / password123");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
