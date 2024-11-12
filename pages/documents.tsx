// /pages/index.tsx
import type { DocumentShape } from "@/graphql/types";
import { gql, useQuery } from "@apollo/client";
import { Checkbox, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import useDebounce from "../lib/debounce";

const DOCUMENTS_QUERY = gql`
  query documents ($search: String, $showArchived: Boolean) {
    documents (search: $search, showArchived: $showArchived) {
      id
      name
      lastPublishedAt
    }
  }
`;

function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [debounseSearch, setDebounceSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const { data } = useQuery(DOCUMENTS_QUERY, {
    variables: { search, showArchived },
  });
  const invokeDebounced = useDebounce(
    () => setSearch(debounseSearch),
    300
  );
  useEffect(invokeDebounced, [debounseSearch]);
  useEffect(() => {
    document.title = 'Documents - DevBird Full-Stack Product Engineer';
  }, []);

  const documentRows = data?.documents.map((document: DocumentShape) => (
    <Table.Tr
      key={document.id}
    >
      <Table.Td>{document.id}</Table.Td>
      <Table.Td>{document.name}</Table.Td>
      <Table.Td>{String(document.lastPublishedAt || '-')}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="flex flex-col gap-2 h-full w-full py-4">
      <div className="flex items-center gap-2 px-2">
        <TextInput
          className="w-48"
          onChange={(event) => setDebounceSearch(event.currentTarget.value)}
          placeholder="Search documents"
          value={debounseSearch}
        />

        <Checkbox
          label="Show Archived"
          onChange={(event) => {
            setShowArchived(event.currentTarget.checked)
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
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Last Published</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{documentRows}</Table.Tbody>
        </Table>
      </div>
    </div>
  );
}

export default DocumentsPage;
