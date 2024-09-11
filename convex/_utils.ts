import { clerkMiddleware } from "@clerk/nextjs/server";
import { QueryCtx, MutationCtx } from "./_generated/server";


export const getUserbyClerkID = async ({
    ctx, clerkID,
}:{ctx: QueryCtx | MutationCtx;
    clerkID: string;
}) => {

    return await ctx.db
    .query("users")
    .withIndex("by_clerkID",(q) => q.eq
    ("clerkID",clerkID)).unique();
};