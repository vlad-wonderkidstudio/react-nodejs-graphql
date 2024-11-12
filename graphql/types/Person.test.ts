import { parse } from "graphql";
import { describe, expect, test } from "vitest";

import { assertSingleValue, executor } from "../schema.test";
import { SortOrderEnum } from "../../lib/enums";

describe("people", () => {
  async function getPeople(
    variables: {
      showAudienceOfAPublishedDocument?: boolean;
      search?: string;
      orderBy?: object;
    } = {},
  ) {
    const result = await executor({
      document: parse(`
        query people ($search: String, $showAudienceOfAPublishedDocument: Boolean, $orderBy: PersonOrderByUpdatedAtInput) {
          people (search: $search, showAudienceOfAPublishedDocument: $showAudienceOfAPublishedDocument, orderBy: $orderBy) {
            id
            fullName
            metadata {
              city
              country
              state
            }
          }
        }
      `),
      variables,
    });
    assertSingleValue(result);
    return result.data;
  }

  test("return all documents", async () => {
    const { people } = await getPeople();
    expect(people.length).toEqual(23);
  });

  test("return all documents w/ search", async () => {
    const { people } = await getPeople({
      search: "Simpson",
    });
    expect(people.length).toEqual(5);
  });

  test("return all documents w/ search", async () => {
    const { people } = await getPeople({
      search: "Simpson",
      showAudienceOfAPublishedDocument: true,
      orderBy: {
        fullName: SortOrderEnum.asc
      },
    });
    expect(people.length).toEqual(5);
    expect(people[0].fullName).toEqual('Abe Simpson');
    expect(people[0].metadata.country).not.toBeFalsy();
  });

  test("return all documents w/ search", async () => {
    const { people } = await getPeople({
      search: "ho",
      showAudienceOfAPublishedDocument: true,
      orderBy: {
        fullName: SortOrderEnum.desc
      },
    });
    expect(people.length).toEqual(2);
    expect(people[0].fullName).toEqual('Milhouse Van Houten');
    expect(people[0].metadata.country).not.toBeFalsy();
  });
});
