import { CredentialsDto, IdentityDto } from "../models";
import { invoke } from "@tauri-apps/api/tauri";

export const exportCredentials = async (
  profileName: string
): Promise<CredentialsDto> => {
  return await invoke("export_credentials", { profileName });
};

export const getCallerIdentity = async (
  profileName: string
): Promise<IdentityDto> => {
  return await invoke("get_caller_identity", { profileName });
};

export const listProfiles = async (): Promise<string[]> => {
  return await invoke("list_profiles");
};

export const login = async (profileName: string): Promise<string> => {
  return await invoke("login", { profileName });
};

export const openUrl = async (url: string): Promise<void> => {
  return await invoke("open_url", { url });
};
