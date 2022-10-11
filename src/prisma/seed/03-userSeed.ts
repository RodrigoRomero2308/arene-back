import { Prisma, PrismaClient } from '@prisma/client';

const seedUsers = async (prisma: PrismaClient) => {
  console.log('Seeding users...');
  const now = new Date();
  const adminUser: Prisma.UserCreateInput = {
    dni: 'ADMIN',
    active: true,
    email: 'ADMIN',
    firstname: 'Admin',
    lastname: 'Admin',
    password: 'NOTACCESS', // queda a criterio del desarrollador reemplazar los valores para acceder
    birth_date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
  };

  const dbAdminUser = await prisma.user.findFirst({
    where: {
      dni: 'ADMIN',
    },
  });

  if (dbAdminUser) {
    console.log('Admin user already exists');
    return;
  }

  await prisma.user.create({
    data: adminUser,
  });

  console.log('Created admin user');
};

export default seedUsers;
