import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {
  Button,
  Navbar,
  NavbarBrand,
  SortDescriptor,
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

function sortList<T extends Object>(list: T[], sortDescriptor: SortDescriptor) {
  return list.sort((a, b) => {
    let first = Reflect.get(a, sortDescriptor.column as PropertyKey) as string;
    let second = Reflect.get(b, sortDescriptor.column as PropertyKey) as string;

    let cmp =
      (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

    if (sortDescriptor.direction === "descending") {
      cmp *= -1;
    }

    return cmp;
  });
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const profiles = useAsyncList<Profile>({
    initialSortDescriptor: {
      column: "name",
      direction: "ascending",
    },
    async load({ sortDescriptor }) {
      // await delay(5000);
      const items = ((await invoke("list_profiles")) as string[]).map(
        (profileName: string): Profile => ({
          name: profileName,
        })
      );

      setIsLoading(false);
      return {
        items: sortList(items, sortDescriptor),
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: sortList(items, sortDescriptor),
      };
    },
  });

  const onLogin = async (profileName: string) => {
    const result = await invoke("login", { profileName });
    console.log(result);
  };

  return (
    <div className="w-full h-full">
      <Navbar shouldHideOnScroll>
        <NavbarBrand>AWS Console</NavbarBrand>
      </Navbar>
      <Table
        aria-label="AWS Profiles"
        isHeaderSticky
        isStriped
        sortDescriptor={profiles.sortDescriptor}
        onSortChange={profiles.sort}
        selectionBehavior="replace"
        selectionMode="single"
        classNames={{
          wrapper: "overflow-clip",
        }}
      >
        <TableHeader>
          <TableColumn aria-label="Profile Name" key="name" allowsSorting>
            Profile Name
          </TableColumn>
          <TableColumn aria-label="Actions">Actions</TableColumn>
        </TableHeader>
        <TableBody
          items={profiles.items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent="No profiles to display."
        >
          {(profile) => (
            <TableRow key={profile.name}>
              <TableCell>{profile.name}</TableCell>
              <TableCell>
                <Button onPress={() => onLogin(profile.name)}>Login</Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
