// graphql/schema.ts
import { builder } from "./builder";
import "./types/Document";
import "./types/Person";
import "./types/PersonMetadata";

export const schema = builder.toSchema();
