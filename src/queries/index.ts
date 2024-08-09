import { invoke } from "@tauri-apps/api/tauri";

export const listProfiles = async (): Promise<string[]> => {
  return (await invoke("list_profiles")) as string[];
};

export const login = async (profileName: string): Promise<string> => {
  return (await invoke("login", { profileName })) as string;
};
