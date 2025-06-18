import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth/config";

export default NextAuth(authOptions);

export const getServerAuthSession = (ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
