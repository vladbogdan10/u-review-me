import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */

  interface Session {
    user: {
      image: string | null | undefined;
      email: string | null | undefined;
      name: string | null | undefined;
      username: string | null | undefined;
      newUser: boolean | null | undefined;
      id: string | null | undefined;
    };
  }
}
