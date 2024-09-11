import {defineSchema, defineTable} from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        username: v.string(),
        imageurl: v.string(),
        clerkID: v.string(),
        email: v.string(),
    }).index("by_email",["email"]).index("by_clerkID",["clerkID"]),
    requests: defineTable({
        sender: v.id("users"),
        receiver: v.id("users"),
    }).index("by_receiver",["receiver"]).index("by_receiver_sender",["receiver", "sender"]),
    friends: defineTable({
        user1: v.id("users"),
        user2: v.id("users"),
        conversationId: v.id("conversations")
    }).index("by_user1",["user1"]).index("by_user2",["user2"]).index("by_conversationid",["conversationId"]),
    conversations: defineTable({
        name: v.optional(v.string()),
        isGroup: v.boolean(),
        lastmessageid: v.optional(v.id("messages")),
    }),
    conversationMembers: defineTable({
        memberID: v.id("users"),
        conversationId: v.id("conversations"),
        lastseenMessage: v.optional(v.id("messages")),
    }).index("by_memberID",["memberID"]).index("by_conversationId",["conversationId"]).index("by_memberID_conversationId",["memberID","conversationId"]),
    messages: defineTable({
        senderID: v.id("users"),
        conversationId: v.id("conversations"),
        type: v.string(),
        content: v.array(v.string()),
    }).index("by_conversationId",["conversationId"]),
});