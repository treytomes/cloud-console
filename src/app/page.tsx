import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

type Profile = {
  name: string;
};

// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  let list = useAsyncList<Profile>({
    initialSortDescriptor: {
      column: "name",
      direction: "ascending",
    },
    async load() {
      // await delay(5000);
      const items = ((await invoke("list_profiles")) as string[]).map(
        (profileName: string): Profile => ({
          name: profileName,
        })
      );
      setIsLoading(false);
      return {
        items,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = Reflect.get(a, sortDescriptor.column as PropertyKey);
          let second = Reflect.get(b, sortDescriptor.column as PropertyKey);

          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  const onLogin = async (profileName: string) => {
    console.log("Begin onLogin");
    const result = await invoke("login", { profileName });
    console.log(result);
    console.log("End onLogin");
  };

  return (
    <div>
      <label>AWS Profiles</label>

      <Table
        aria-label="AWS Profiles"
        isHeaderSticky
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          <TableColumn aria-label="Profile Name" key="name" allowsSorting>
            Profile Name
          </TableColumn>
          <TableColumn aria-label="Actions">Actions</TableColumn>
        </TableHeader>
        <TableBody
          items={list.items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent="No profiles to display."
        >
          {(item) => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Button onPress={() => onLogin(item.name)}>Login</Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
