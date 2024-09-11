import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserbyClerkID } from "./_utils";

export const get = query({
    args: {
        id: v.id("conversations")
    },
    handler: async (ctx, args) => {
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

        const memebership = await ctx.db.query("conversationMembers").withIndex("by_memberID_conversationId", q => q.eq("memberID",currentUser._id).eq("conversationId", args.id)).unique()

        if(!memebership) {
            throw new ConvexError("Can't access this conversation")
        }

        const messages = await ctx.db.query("messages").withIndex("by_conversationId", q => q.eq("conversationId", args.id)).order("desc").collect()

        const messageWithUsers = Promise.all(messages.map(async message => {
            const messageSender = await ctx.db.get(message.senderID)
            if(!messageSender) {
                throw new ConvexError ("Could not find message sender");
            }

            return {
                message,
                senderImage: messageSender.imageurl,
                senderName: messageSender.username,
                isCurrentUser: messageSender._id === currentUser._id
            }
        })
    )
    return messageWithUsers;
    },
});