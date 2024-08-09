import { useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Navbar,
  NavbarBrand,
  Spinner,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { Profile } from "../models";
import { LoaderContext } from "../context/LoaderContext";
import { delay } from "../util";
import toast from "react-hot-toast";

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

  const onLogin = async (profile: Profile) => {
    toast.promise(profile.login(), {
      loading: `Logging in to ${profile.name}...`,
      success: `Logged in as ${profile.name}.`,
      error: (err) => `Unable to log in to ${profile.name}: ${err}`,
    });
  };

  return (
    <div className="w-full h-full">
      <Navbar>
        <NavbarBrand>AWS Console</NavbarBrand>
      </Navbar>

      <Accordion variant="shadow">
        {profiles.map((profile) => (
          <AccordionItem
            textValue="A Text VAlue"
            key={profile.name}
            aria-label={profile.name}
            title={profile.name}
          >
            <Button
              disabled={loader.isVisible}
              onClick={() => onLogin(profile)}
            >
              Login
            </Button>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
