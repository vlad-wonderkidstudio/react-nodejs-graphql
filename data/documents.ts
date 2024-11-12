import type { DocumentShape } from "@/graphql/types";
import { State } from "country-state-city";
import { add } from "date-fns";
import { people } from "./people";

const today = new Date();
const yesterday = add(today, { days: -1 });
const lastWeek = add(today, { days: -7 });

export const documents: DocumentShape[] = [
  {
    name: "Employee Handbook",
    lastPublishedAt: yesterday,
    publishedAt: today,
    audienceMembers: people,
  },
  {
    name: "Code of Conduct",
    lastPublishedAt: today,
    publishedAt: today,
    audienceMembers: people.slice(0, 10),
  },
  {
    name: "Archived Handbook",
    archivedAt: new Date(),
  },
  ...State.getStatesOfCountry("US").map((state, index) => ({
    name: `${state.name} Addendum`,
    lastPublishedAt: lastWeek,
    publishedAt: lastWeek,
    audienceMembers: people.slice(index, index + 2),
  })),
].map((document, index) => ({
  ...document,
  id: index + 1,
}));
