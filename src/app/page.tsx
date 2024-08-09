import { useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Navbar,
  NavbarBrand,
  select,
  Selection,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Profile } from "../models";
import { LoaderContext } from "../context/LoaderContext";
import toast from "react-hot-toast";
import { exportCredentials } from "../queries";

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const loader = useContext(LoaderContext);

  useEffect(() => {
    loader.show("Loading profiles...");
    Profile.getAll().then((profiles) => {
      setProfiles(profiles);
      loader.hide();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reinsert a fresh update of the profile into the list.
  const reloadProfile = (profile: Profile) => {
    console.log("reloading profiles");
    setProfiles(
      [profile, ...profiles.filter((x) => x.name !== profile.name)].sort(
        (a, b) => a.name.localeCompare(b.name)
      )
    );
  };

  const onLogin = async (profile: Profile) => {
    toast.promise(
      profile
        .login()
        .then(async () => await profile.loadCredentials())
        .then(() => reloadProfile(profile)),
      {
        loading: `Logging in to ${profile.name}...`,
        success: `Logged in to ${profile.name}.`,
        error: (err) =>
          `Unable to log in to ${profile.name}: ${JSON.stringify(err)}`,
      }
    );
  };

  const onSelectionChange = async (keys: Selection) => {
    let profileNames = [...keys];
    if (!profileNames) {
      return;
    }

    profiles.forEach(async (profile) => {
      if (profileNames.includes(profile.name)) {
        console.log("Loading credentials for profile", profile.name);
        try {
          await profile.loadCredentials();
        } catch (e) {
          toast.error(
            `Profile ${profile.name} does not appear to be logged in.`
          );
        }
      }
    });

    setProfiles(profiles);
  };

  return (
    <div className="w-full h-full">
      <Navbar>
        <NavbarBrand>AWS Console</NavbarBrand>
      </Navbar>

      <Accordion variant="shadow" onSelectionChange={onSelectionChange}>
        {profiles.map((profile) => (
          <AccordionItem
            textValue={profile.name}
            key={profile.name}
            aria-label={profile.name}
            title={profile.name}
          >
            <div>
              <div className="rounded-lg bg-zinc-800 p-2 flex gap-2">
                <Button
                  disabled={loader.isVisible}
                  onClick={() => onLogin(profile)}
                >
                  Login
                </Button>
                <Button>A</Button>
                <Button>B</Button>
                <Button>C</Button>
                <Button>D</Button>
              </div>

              {profile.credentials && (
                <div>
                  <table className="table-fixed">
                    <tbody>
                      <tr className="odd:bg-gray-100 odd:dark:bg-gray-800 hover:bg-stone-100 hover:dark:bg-gray-600">
                        <th className="min-w-48">access-key-id</th>
                        <td>{profile.credentials.accessKeyId}</td>
                      </tr>
                      <tr className="odd:bg-gray-100 odd:dark:bg-gray-800 hover:bg-stone-100 hover:dark:bg-gray-600">
                        <th>secret-access-key</th>
                        <td>{profile.credentials.secretAccessKey}</td>
                      </tr>
                      <tr className="odd:bg-gray-100 odd:dark:bg-gray-800 hover:bg-stone-100 hover:dark:bg-gray-600">
                        <th>session-token</th>
                        <td>{profile.credentials.sessionToken}</td>
                      </tr>
                      <tr className="odd:bg-gray-100 odd:dark:bg-gray-800 hover:bg-stone-100 hover:dark:bg-gray-600">
                        <th>expiration</th>
                        <td>
                          {profile.credentials.expiration
                            .toJSDate()
                            .toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {!profile.credentials && profile.isLoggedIn && <Spinner />}

              {!profile.credentials && !profile.isLoggedIn && (
                <div className="text-large">
                  Please log in to view profile details.
                </div>
              )}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
