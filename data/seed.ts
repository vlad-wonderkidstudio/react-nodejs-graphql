import { PrismaClient, Prisma } from '@prisma/client'
import { City, Country, State } from "country-state-city";
import { add } from "date-fns";
import simpsons from "./simpsons.json"; 
import { create } from 'domain';

const prisma = new PrismaClient();

// Ensure each name is unique
type Simpson = (typeof simpsons)[0];
const simpsonsByName = new Map<string, Simpson>();
for (const json of simpsons) {
  simpsonsByName.set(json.character, json);
}

// Date consts
const today = new Date();
const yesterday = add(today, { days: -1 });
const lastWeek = add(today, { days: -7 });

async function main() {
  console.log('Start seeding ...');
  
  console.log('Seed people');
  const createdPeople: Prisma.PersonWhereUniqueInput[] = [];
  let index = 0;
  for (const json of Array.from(simpsonsByName.values())) {
    const countries = Country.getAllCountries();
    const country = countries[index];
    const state = State.getStatesOfCountry(country.isoCode)[index];
    const cities = City.getCitiesOfCountry(country.isoCode);
    const city = cities?.[index];

    const createdPerson = await prisma.person.create({
      data: {
        fullName: String(json.character),
        image: String(json.image),
        metadata: {
          create: {
            country: country.name,
            state: state?.name,
            city: city?.name,
          }
        },
      }
    });
    createdPeople.push({ id: createdPerson.id });
    index++;
  };

  console.log('Seed documents');
  // Mandatory documents
  await prisma.document.create({
    data: {
      name: 'Employee Handbook',
      lastPublishedAt: yesterday,
      publishedAt: today,
      audienceMembers: {
        connect: createdPeople,
      }
    }
  });
  await prisma.document.create({
    data: {
      name: 'Code of Conduct',
      lastPublishedAt: today,
      publishedAt: today,
      audienceMembers: {
        connect: createdPeople.slice(0, 10),
      }
    }
  });
  await prisma.document.create({
    data: {
      name: 'Archived Handbook',
      archivedAt: new Date(),
    }
  });
  
  // Generated documents
  index = 0;
  for (const state of State.getStatesOfCountry('US')) {
    await prisma.document.create({
      data: {
        name: `${state.name} Addendum`,
        lastPublishedAt: lastWeek,
        publishedAt: lastWeek,
        audienceMembers: {
          connect: createdPeople.slice(index, index + 2),
        }
      }
    });
    index++;
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })