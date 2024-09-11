import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserbyClerkID } from "./_utils";

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

        const requests = await ctx.db
        .query("requests")
        .withIndex("by_receiver", q => q.eq("receiver", currentUser._id))
        .collect();

        const requestWithSender = await 
        Promise.all(
            requests.map(async (request) => {
                const sender = await ctx.db.get(request.sender);

                if(!sender){
                    throw new ConvexError("Request sender could not be found")
                }
                return {sender, request};
            })
        );
        return requestWithSender;
    },
});

export const count = query({args:{},
handler: async (ctx, args) => {
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

    const requests = await ctx.db
    .query("requests")
    .withIndex("by_receiver", q => q.eq("receiver", currentUser._id))
    .collect();

    return requests.length;
},})