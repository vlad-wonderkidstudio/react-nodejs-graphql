import { buildHTTPExecutor } from "@graphql-tools/executor-http";

import { createYoga } from "graphql-yoga";
import { schema } from "./schema";

const yoga = createYoga({ schema });

export const executor = buildHTTPExecutor({
  fetch: yoga.fetch,
});

export function assertSingleValue<TValue extends object>(
  value: TValue | AsyncIterable<TValue>,
): asserts value is TValue {
  if (Symbol.asyncIterator in value) {
    throw new Error("Expected single value");
  }
}
