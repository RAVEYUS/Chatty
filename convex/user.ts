import { internalMutation, internalQuery } from "./_generated/server"
import {v} from "convex/values"
export const create = internalMutation({
    args: {
        username: v.string(),
        imageurl: v.string(),
        clerkID: v.string(),
        email: v.string(),
    },
    handler: async(ctx,args)=> {
        await ctx.db.insert("users",args);
    },
})

export const get = internalQuery({
    args: {clerkID: v.string()},
    async handler(ctx, args){
        return ctx.db.query("users").withIndex("by_clerkID",(q)=> q.eq("clerkID",args.clerkID)).unique();
        
    }
})