// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      accessToken?: string;
      clientId: string;
      user?: {
        id: string;
        role?: string;
      };
    }
  }
}

export {};
