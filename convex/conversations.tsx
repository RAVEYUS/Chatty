import { ConvexError } from "convex/values";
import { MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUserbyClerkID } from "./_utils";
import { Id } from "./_generated/dataModel";
import { send } from "process";

export const get = query({args: {},
    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new ConvexError("Unauthorized");
        }

        const currentUser = await getUserbyClerkID({
            ctx, clerkID: identity.subject
        })
        
        if(!currentUser) {
            throw new ConvexError("User not Found")
        }

        const conversationsMemberships = 
        await ctx.db.query("conversationMembers").withIndex("by_memberID", q => q.eq("memberID", currentUser._id)).collect()

        const conversations = Promise.all(conversationsMemberships?.map
            (async (membership) => {
            const conversation = await ctx.db.get(membership.conversationId);

            if(!conversation) {
                throw new ConvexError("Conversation could not be found")
            }
            
            return conversation;
        })
    );
    const conversationsWithDetails = await Promise.all((await conversations).map(async (conversation, index) => {
        const allConversationMemberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId", q => q.eq("conversationId", conversation?._id)).collect();

        const lastmessage = await getLastmessageDetails({ctx,id: conversation.lastmessageid,})

        if(conversation.isGroup) {
            return {conversation, lastmessage}
        } else {
            const otherMembership = allConversationMemberships.filter((membership) => membership.memberID !== currentUser._id)[0];
            const otherMember = await ctx.db.get(otherMembership.memberID);
            return {
                conversation,
                otherMember,
                lastmessage
            };
        }

    },
))

return conversationsWithDetails;
    },
});

const getLastmessageDetails = async({ctx, id}: {ctx: QueryCtx | MutationCtx; id: Id<"messages"> | undefined}) => {
    if(!id) return null;

const message = await ctx.db.get(id)
if(!message){
    return null
}

const sender = await ctx.db.get(message.senderID)
if(!sender) return null;

const content = getMessageContent(message.type, message.content as unknown as string)
return {
    content,
    sender: sender.username
}

}

const getMessageContent =(type: string, content: string) => {
    switch(type){
        case "text":
            return content;
        default:
            return "[Non-text]"
    }
}