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

        const conversation = await ctx.db.get(args.id);

        if (!conversation) {
            throw new ConvexError("Conversation not found")
        }

        const memebership = await ctx.db.query("conversationMembers").withIndex("by_memberID_conversationId", q => q.eq("memberID", currentUser._id).eq("conversationId", conversation._id)).unique();

        if (!memebership) {
            throw new ConvexError("Unauthorized to access this conversation");
        }

        const allConversationMemberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId", q => q.eq("conversationId", args.id)).collect();

        if (!conversation.isGroup) {
            const otherMembership = allConversationMemberships.filter(memebership => memebership.memberID !== currentUser._id)[0]

            const otherMemberDetails = await ctx.db.get(otherMembership.memberID)

            return {
                ...conversation,
                otherMember: {
                    ...otherMemberDetails,
                    lastseenMessageID: otherMembership.lastseenMessage
                },
                otherMembers: null
            }
        }

    },
});