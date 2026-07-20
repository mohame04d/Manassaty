import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@techacher.com' },
    update: { role: 'SUPERADMIN' },
    create: {
      email: 'admin@techacher.com',
      password: hashedPassword,
      name: 'مدير النظام',
      role: 'SUPERADMIN',
    },
  });

  console.log('Super Admin created successfully:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
