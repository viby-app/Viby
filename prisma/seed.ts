import { PrismaClient, Gender, Role, AppointmentStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number({ style: "national" }),
          gender: faker.helpers.arrayElement(Object.values(Gender)),
          role: Role.USER,
        },
      }),
    ),
  );

  // Create Businesses (assign to random user)
  const businesses = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.business.create({
        data: {
          name: faker.company.name(),
          address: faker.location.streetAddress(),
          phone: faker.phone.number({ style: "national" }),
          description: faker.company.catchPhrase(),
          ownerId: faker.helpers.arrayElement(users).id,
        },
      }),
    ),
  );

  // Create Services
  const services = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.service.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          durationMinutes: faker.number.int({ min: 15, max: 90 }),
          price: faker.number.float({ min: 50, max: 200 }),
        },
      }),
    ),
  );

  // Create Workers for each Business
  const workers = await Promise.all(
    businesses.flatMap((b) =>
      Array.from({ length: 4 }).map(() => {
        const user = faker.helpers.arrayElement(users);
        return prisma.workers.create({
          data: {
            businessId: b.id,
            userId: user.id,
            wage: faker.number.float({ min: 50, max: 200 }),
          },
        });
      }),
    ),
  );

  // Assign Services to Workers
  await Promise.all(
    workers.map((worker) => {
      const shuffled = faker.helpers.shuffle(services);
      const selected = shuffled.slice(0, 3);
      return Promise.all(
        selected.map((service) =>
          prisma.workerService.create({
            data: {
              workerId: worker.id,
              serviceId: service.id,
            },
          }),
        ),
      );
    }),
  );

  // Create Appointments
  await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      const worker = faker.helpers.arrayElement(workers);
      const user = faker.helpers.arrayElement(users);
      const service = await prisma.workerService.findFirst({
        where: { workerId: worker.id },
        include: { service: true },
      });

      if (!service) return;

      return prisma.appointment.create({
        data: {
          businessId: worker.businessId,
          userId: user.id,
          workerId: worker.id,
          serviceId: service.serviceId,
          status: faker.helpers.arrayElement(Object.values(AppointmentStatus)),
          date: faker.date.soon({ days: 30 }),
        },
      });
    }),
  );

  console.log("✅ Seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
