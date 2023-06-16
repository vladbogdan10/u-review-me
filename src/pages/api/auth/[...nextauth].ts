import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { getMongoClient } from '../../../utils/dbConnect';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import User from '../../../models/User';
import UserRepository from '../../../repository/UserRepository';
import { nanoid } from 'nanoid';

export default NextAuth({
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/login', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        // @ts-ignore
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  // @ts-ignore
  adapter: MongoDBAdapter(getMongoClient()),
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        const user = await new UserRepository().findById(token.sub);

        session.user = {
          ...session.user,
          image: user.image ?? '',
          username: user.username,
          newUser: user.newUser,
          id: token.sub,
        };
      }

      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      await User.findByIdAndUpdate(user.id, {
        newUser: true,
        username: nanoid(8), // IMPORTANT! default username until user creates one!
      });
    },
  },
  debug: false,
});
