import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects";
import { DateResolver } from "graphql-scalars";

import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import prisma from '../lib/prisma';

export const DEFAULT_ITEMS_MAX = 100;

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: {}
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  }
}>({
  plugins: [
    RelayPlugin,
    SimpleObjectsPlugin,
    PrismaPlugin,
  ],
  prisma: {
    client: prisma,
  },
  relayOptions: {},
});

builder.queryType({})

builder.addScalarType("Date", DateResolver, {});
