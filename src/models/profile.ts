import * as queries from "../queries";
import { Credentials } from "./credentials";

/**
 * An AWS SSO profile.
 */
export class Profile {
  readonly name: string;
  credentials?: Credentials;
  isLoggedIn: boolean;

  private constructor(name: string) {
    this.name = name;
    this.isLoggedIn = false;
  }

  async loadCredentials(): Promise<Credentials> {
    try {
      if (!this.credentials) {
        this.credentials = new Credentials(
          await queries.exportCredentials(this.name)
        );
      }
      this.isLoggedIn = true;
      return this.credentials;
    } catch (e) {
      this.isLoggedIn = false;
      throw new Error(
        `Failed to load credentials for profile '${this.name}': ${e}`
      );
    }
  }

  async login(): Promise<string> {
    try {
      const result = await queries.login(this.name);
      await this.loadCredentials();
      this.isLoggedIn = true;
      return result;
    } catch (e) {
      this.isLoggedIn = false;
      throw new Error(`Failed to login to profile '${this.name}': ${e}`);
    }
  }

  static async getAll(): Promise<Profile[]> {
    return (await queries.listProfiles())
      .map((name) => new Profile(name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
