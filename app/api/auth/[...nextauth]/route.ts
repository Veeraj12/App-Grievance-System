import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {}
      },

      async authorize(credentials) {
        if (!credentials) {
          console.error("No credentials provided");
          throw new Error("Credentials are required");
        }

        console.log("Login attempt with email:", credentials.email);

        const email = credentials.email?.toLowerCase().trim();

        if (!email || !credentials.password) {
          console.error("Missing email or password");
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email }
        });
        console.log("Database query completed for email:", user?.email);

        if (!user) {
          console.error("User not found for email:", email);
          throw new Error("User not found");
        }

        console.log("User found, checking password...");

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!validPassword) {
          console.error("Password mismatch for user:", email);
          throw new Error("Invalid password");
        }

        console.log("Login successful for:", email);

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {

    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token } : { session: Session; token: JWT }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };