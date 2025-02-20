import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEBUG = true; // Enable logging for debugging

// ✅ Fetch messages for a specific chat
export const list = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();

    if (DEBUG) {
      console.log("Fetched Messages:", {
        chatId: args.chatId,
        count: messages.length,
      });
    }

    return messages;
  },
});

// ✅ Store user messages (Markdown supported)
export const send = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(), // Markdown formatted content
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content, // No escaping needed
      role: "user",
      createdAt: Date.now(),
    });

    if (DEBUG) {
      console.log("Saved User Message:", { messageId, chatId: args.chatId });
    }

    return messageId;
  },
});

// ✅ Store AI-generated assistant messages
export const store = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content, // Store Markdown directly
      role: args.role,
      createdAt: Date.now(),
    });

    if (DEBUG) {
      console.log("Stored Message:", {
        messageId,
        chatId: args.chatId,
        role: args.role,
      });
    }

    return messageId;
  },
});

// ✅ Get the last message in a chat
export const getLastMessage = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .first();

    return message;
  },
});
