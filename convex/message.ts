import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserbyClerkID } from "./_utils";

export const create = mutation({
    args:{
        conversationId: v.id("conversations"),
        type: v.string(),
        content: v.array(v.string())
    },
    handler: async (ctx, args) =>{
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        const currentUser = await getUserbyClerkID({
            ctx, clerkID: identity.subject
        })

        if (!currentUser) {
            throw new ConvexError("User not Found")
        }

        const memebership = await ctx.db.query("conversationMembers").withIndex("by_memberID_conversationId", q => q.eq("memberID",currentUser._id).eq("conversationId", args.conversationId)).unique()

        if(!memebership) {
            throw new ConvexError("Can't access this conversation")
        }

        const message = await ctx.db.insert("messages", {
            senderID: currentUser._id,
            ...args
        })

        await ctx.db.patch(args.conversationId, {
            lastmessageid: message  });

        return message;
    }
})