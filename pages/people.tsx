import type { PersonShape, OrderByType } from "@/graphql/types";
import { SortOrderEnum } from "../lib/enums";
import { gql, useQuery } from "@apollo/client";
import { Checkbox, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import UPSVGICON from "../public/icons/arrow-long-up.svg";
import DOWNSVGICON from "../public/icons/arrow-long-down.svg";
import useDebounce from "../lib/debounce";

const PEOPLE_QUERY = gql`
  query people ($search: String, $showAudienceOfAPublishedDocument: Boolean, $orderBy: PersonOrderByUpdatedAtInput) {
    people (search: $search, showAudienceOfAPublishedDocument: $showAudienceOfAPublishedDocument, orderBy: $orderBy) {
      image
      fullName
      metadata {
        city
        country
        state
      }
    }
  }
`;

function PeoplePage() {
  const [search, setSearch] = useState("");
  const [debounseSearch, setDebounceSearch] = useState("");
  const [showAudienceOfAPublishedDocument, setShowAudienceOfAPublishedDocument] = useState(false);
  const [orderBy, setOrderBy] = useState<OrderByType>({});
  const { data } = useQuery(PEOPLE_QUERY, {
    variables: { showAudienceOfAPublishedDocument, search, orderBy },
  });
  const invokeDebounced = useDebounce(
    () => setSearch(debounseSearch),
    300
  );
  useEffect(invokeDebounced, [debounseSearch]);
  useEffect(() => {
    document.title = 'People - DevBird Full-Stack Product Engineer';
  }, []);

  const peopleRows = data?.people.map((person: PersonShape) => (
    <Table.Tr
      key={person.fullName}
    >
      <Table.Td>
        <img
          src={person.image}
          width="100"
          alt={""}
        />
      </Table.Td>
      <Table.Td className="align-top">
        <div className="grid grid-cols=12 mt-2">
          <div className="col-span-12 pb-5">
            <b>{person.fullName}</b>
          </div>
          <div className="col-span-2 pr-1">Country:</div>
          <div className="col-span-10">{person.metadata.country}</div>
          { person.metadata.state &&
            <>
              <div className="col-span-2 pr-1">State:</div>
              <div className="col-span-10">{person.metadata.state}</div>
            </> 
          }
          { person.metadata.city &&
            <>
              <div className="col-span-2 pr-1">City:</div>
              <div className="col-span-10">{person.metadata.city}</div>
            </>
          }
        </div>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="flex flex-col gap-2 h-full w-full py-4">
      <div className="flex items-center gap-2 px-2">
        <TextInput
          className="w-48"
          onChange={(event) => setDebounceSearch(event.currentTarget.value)}
          placeholder="Search people"
          value={debounseSearch}
        />

        <Checkbox
          label="Show Audience For A Published Document"
          onChange={(event) => {
            setShowAudienceOfAPublishedDocument(event.currentTarget.checked)
          }}
        />
      </div>
      <div className="block overflow-y-auto h-full w-full">
        <Table
          className="w-full"
          highlightOnHover 
        >
          <Table.Thead className="sticky top-0 bg-white">
            <Table.Tr>
              <Table.Th>Image</Table.Th>
              <Table.Th
                className="cursor-pointer"
                onClick={(event) => { console.log('onClick', orderBy);
                  let newOrder:OrderByType = {};
                  if (!orderBy?.fullName) {
                    newOrder = { fullName: SortOrderEnum.asc };
                  } else if (orderBy.fullName === SortOrderEnum.asc) {
                    newOrder = { fullName: SortOrderEnum.desc };
                  }

                  setOrderBy(newOrder); 
                }}
              >
                <div className="flex items-left">
                  <div>
                    Full Name
                  </div>
                  <div>
                    <Image
                      className={ (orderBy.fullName === SortOrderEnum.asc) ? '' : 'hidden' }
                      src={UPSVGICON}
                      alt = {""}
                    />
                    <Image
                      className={ (orderBy.fullName === SortOrderEnum.desc) ? '' : 'hidden' }
                      src={DOWNSVGICON}
                      alt = {""}
                    />
                  </div>
                </div>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{peopleRows}</Table.Tbody>
        </Table>
      </div>
    </div>
  );
}

export default PeoplePage;
