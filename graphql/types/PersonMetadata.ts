import { builder } from "../builder";
import type { PersonShape } from "./Person";

export type PersonMetadataShape = {
  id: number;
  country: string;
  state?: string;
  city?: string;
  person: PersonShape;
};

export const PersonMetadata = builder.prismaObject('PersonMetadata',{
  fields: (t) => ({
    id: t.exposeInt('id'),
    country: t.exposeString('country'),
    state: t.exposeString('state', {
      nullable: true,
    }),
    city: t.exposeString('city', {
      nullable: true,
    }),
  }),
});
