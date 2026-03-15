import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with test user...");

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "user@test.com" },
    });

    if (existingUser) {
      console.log("User already exists:", existingUser.email);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create test users with different roles
    const users: Array<{
      name: string;
      email: string;
      password: string;
      role: Role;
    }> = [
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
      console.log(`Created user: ${user.email} (${user.role})`);
    }

    console.log("✅ Database seeded successfully!");
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
