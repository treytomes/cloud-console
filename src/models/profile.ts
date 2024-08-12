import * as queries from "../queries";
import { Credentials } from "./credentials";
import { Identity } from "./identity";

/**
 * An AWS SSO profile.
 */
export class Profile {
  readonly name: string;
  credentials?: Credentials;
  identity?: Identity;
  isLoggedIn?: boolean;

  private constructor(name: string) {
    this.name = name;
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

  async loadIdentity(): Promise<Identity> {
    try {
      if (!this.identity) {
        this.identity = new Identity(
          await queries.getCallerIdentity(this.name)
        );
      }
      this.isLoggedIn = true;
      console.log("identity", this.identity);
      return this.identity;
    } catch (e) {
      this.isLoggedIn = false;
      throw new Error(
        `Failed to load identity for profile '${this.name}': ${e}`
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

  async openWebConsole(): Promise<void> {
    await queries.openWebConsole(this);
  }

  static async getAll(): Promise<Profile[]> {
    return (await queries.listProfiles())
      .map((name) => new Profile(name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
