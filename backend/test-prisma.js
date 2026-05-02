const { PrismaClient } = require('@prisma/client');
try {
  const prisma = new PrismaClient();
  console.log("Success with empty");
} catch (e) {
  console.log("Error with empty:", e.message);
}
