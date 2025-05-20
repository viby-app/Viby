import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getUser: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
        });

        return user;
    }),

    getUserFriends: protectedProcedure.query(async ({ ctx }) => {
        const linkedUsers = await ctx.db.userConnection.findMany({
            where: {
                OR: [
                    { userConnectionA: ctx.session.user.id },
                    { userConnectionB: ctx.session.user.id },
                ]
            },
        });

        return linkedUsers;
    }),
});