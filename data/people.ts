import type { PersonShape } from "@/graphql/types";
import { City, Country, State } from "country-state-city";
import simpsons from "./simpsons.json"; // Credit: https://github.com/zuberdasu/simpsons_api

// Ensure each name is unique
type Simpson = (typeof simpsons)[0];
const simpsonsByName = new Map<string, Simpson>();
for (const json of simpsons) {
  simpsonsByName.set(json.character, json);
}

export const people: PersonShape[] = Array.from(simpsonsByName.values()).map(
  (json, index) => {
    const countries = Country.getAllCountries();
    const country = countries[index];
    const state = State.getStatesOfCountry(country.isoCode)[index];
    const cities = City.getCitiesOfCountry(country.isoCode);
    const city = cities?.[index];

    return {
      id: index + 1,
      fullName: `${json.character}`,
      metadata: {
        country: country.name,
        state: state?.name,
        city: city?.name,
      },
    };
  },
);
