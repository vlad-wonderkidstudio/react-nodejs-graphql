import { people } from "../../data";
import { builder } from "../builder";
import { prisma } from '../../lib/prisma'
import type { DocumentShape } from "./Document";
import type { PersonMetadataShape } from "./PersonMetadata";
import { SortOrderEnum } from '../../lib/enums'

export type PersonShape = {
  id: number;
  fullName: string;
  image: string;
  metadata: PersonMetadataShape;
  documents: DocumentShape;
};

export type OrderByType = {
  fullName?: SortOrderEnum;
}

export const Person = builder.prismaObject('Person', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    fullName: t.exposeString('fullName'),
    image: t.exposeString('image'),
    metadata: t.relation('metadata'),
    documents: t.relation('documents'),
  }),
});

export const SortOrder = builder.enumType('SortOrder', {
  values: [SortOrderEnum.asc, SortOrderEnum.desc] as const,
})

export const PersonOrderByUpdatedAtInput = builder.inputType(
  'PersonOrderByUpdatedAtInput',
  {
    fields: (t) => ({
      fullName: t.field({
        type: SortOrder,
        required: false,
      }),
    }),
  },
)

builder.queryField('people', (t) =>
  t.prismaField({
    type: [Person],
    args: {
      search: t.arg({
        type: "String",
      }),
      skip: t.arg.int(),
      take: t.arg.int(),
      orderBy: t.arg({
        type: PersonOrderByUpdatedAtInput,
      }),
      showAudienceOfAPublishedDocument: t.arg({
        type: "Boolean",
      })
    },
    resolve: (query, parent, args) => {
      const and: { 'AND'?: any[] } = {};
      if (args.search) {
        and.AND ??= [];
        and.AND.push({ fullName: { contains: args.search } });
      }
      if (args.showAudienceOfAPublishedDocument) {
        and.AND ??= [];
        and.AND.push({ 
          documents: {
            some: {
              publishedAt: {
                not: null,
              }
            }
          } 
        });        
      }
      return prisma.person.findMany({
        ...query,
        where: { ...and  },
        take: args.take ?? 100,
        skip: args.skip ?? 0,
        orderBy: args.orderBy ?? undefined,
      })
    },
  }),
);
