import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      phone: string;
      role?: string;
      hasBusiness?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone?: string;
    name?: string;
    role?: string;
    hasBusiness?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      if (token?.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id },
          select: {
            phone: true,
            name: true,
            role: true,
            businessOwner: {
              select: {
                id: true,
              },
            },
          },
        });

        if (dbUser) {
          token.phone = dbUser.phone ?? "";
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.hasBusiness = !!dbUser.businessOwner[0]?.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.phone = token.phone!;
        session.user.name = token.name!;
        session.user.role = token.role!;
        session.user.hasBusiness = token.hasBusiness!;
      }
      return session;
    },
  },
};
