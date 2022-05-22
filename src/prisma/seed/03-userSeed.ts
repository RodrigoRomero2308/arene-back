import { Prisma, PrismaClient } from '@prisma/client';

const seedUsers = async (prisma: PrismaClient) => {
  console.log('Seeding users...');
  const adminUser: Prisma.UserCreateInput = {
    dni: 'ADMIN',
    active: true,
    email: 'ADMIN',
    firstname: 'Admin',
    lastname: 'Admin',
    phone: '',
    password: 'NOTACCESS', // queda a criterio del desarrollador reemplazar los valores para acceder
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
