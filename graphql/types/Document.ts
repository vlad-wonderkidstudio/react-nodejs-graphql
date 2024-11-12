import { builder } from "../builder";
import { prisma } from '../../lib/prisma'
import type { PersonShape } from "./Person";

export type DocumentShape = {
  id: number;
  name: string;
  publishedAt?: Date;
  lastPublishedAt?: Date;
  archivedAt?: Date;
  audienceMembers?: PersonShape[];
};

export const Document = builder.prismaObject('Document', {
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    publishedAt: t.expose("publishedAt", {
      type: "Date",
      nullable: true,
    }),
    lastPublishedAt: t.expose("lastPublishedAt", {
      type: "Date",
      nullable: true,
    }),
    archivedAt: t.expose("archivedAt", {
      type: "Date",
      nullable: true,
    }),
    audienceMembers: t.relation('audienceMembers'),
  })
});

builder.queryField("documents", (t) =>
  t.prismaField({
    type: [Document],
    args: {
      search: t.arg({
        type: "String",
      }),
      showArchived: t.arg({
        type: "Boolean",
      }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: (query, parent, args) => {
      const and: { 'AND'?: any[] } = {};
      if (args.search) {
        and.AND ??= [];
        and.AND.push({ name: { contains: args.search } });
      }
      if (!args.showArchived) {
        and.AND ??= [];
        and.AND.push({ archivedAt: {equals: null} });
      }

      const myQuery =
      {
        ...query,
        where: { ...and, },
        take: args.take ?? 100,
        skip: args.skip ?? 0,
      };
      return prisma.document.findMany(myQuery);
    },
  }),
);
