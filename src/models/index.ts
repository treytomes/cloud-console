import { sortList } from "@/util";
import * as queries from "../queries";

/**
 * An AWS SSO profile.
 */
export class Profile {
  readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }

  async login(): Promise<string> {
    return await queries.login(this.name);
  }

  static async getAll(): Promise<Profile[]> {
    return (await queries.listProfiles())
      .map((name) => new Profile(name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
