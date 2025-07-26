import { createSlice } from '@reduxjs/toolkit';

import uniqueId from '@/helpers/unique-id';

import { fetchConversations } from './conversations';
import { getConversation } from './helpers';

const INITIAL_STATE = {
  user: null,
  conversations: [],
  activeConversationId: null,
  messages: [],
  draftMessages: {},
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'conversations',
  initialState: INITIAL_STATE,
  reducers: {
    resetState() {
      return INITIAL_STATE;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    // Reducer to select a conversation
    setActiveConversation: (state, action) => {
      const conversationId = action.payload;
      if (state.activeConversationId === conversationId) return;
      state.activeConversationId = conversationId;
      state.messages = [];

      if (!conversationId) return;

      // update unseen count;
      const conversation = getConversation(state.conversations, conversationId);
      conversation.unseenCount = 0;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    sendMessage(state, action) {
      state.messages.push(action.payload);
    },
    receiveMessage(state, action) {
      const userId = state.user._id;
      const activeConversationId = state.activeConversationId;
      let prevMessages = state.messages;

      const newMessage = { ...action.payload };
      // if it is the recipient and the message is not for the active conversation
      if (newMessage.senderId !== userId && newMessage.conversationId !== activeConversationId) {
        const conversation = getConversation(state.conversations, newMessage.conversationId);
        conversation.unseenCount++;
      }
      // if the conversation is not active, we don't need to update the messages
      if (newMessage.conversationId !== activeConversationId) {
        return;
      }

      // if the sender is the current user
      if (newMessage.senderId === userId) {
        const existingIndex = prevMessages.findIndex((msg) => msg.clientId === newMessage.clientId);
        if (existingIndex !== -1) {
          // free the URL object to avoid memory leaks
          let existingMessage = prevMessages[existingIndex];
          if (existingMessage.media?.url && existingMessage.media?.url.startsWith('blob:')) {
            URL.revokeObjectURL(existingMessage.media?.url);
          }

          prevMessages[existingIndex] = newMessage;
        }
        // if sender is on another device
        else {
          prevMessages.push(newMessage);
        }
      }
      // if it is the recipient
      else {
        prevMessages.push(newMessage);
        newMessage.readAt = new Date().toISOString();
      }
    },
    updateLastMessage(state, action) {
      const newMessage = action.payload;
      const conversation = getConversation(state.conversations, newMessage.conversationId);

      // if there is no last message or the last message is older than the new message
      if (
        !conversation?.lastMessage ||
        new Date(conversation?.lastMessageTimestamp) <= new Date(newMessage?.createdAt)
      ) {
        conversation.lastMessage = newMessage;
        conversation.lastMessageSender = newMessage.senderId;
        conversation.lastMessageTimestamp = newMessage.createdAt;
      }
    },
    startNewIndividualChat(state, action) {
      const otherUser = action.payload;
      const newConversation = {
        clientId: uniqueId(), // Temporary ID
        type: 'individual',
        otherUser,
        // status: 'optimistic-creating',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessage: null,
        lastMessageContent: null,
        lastMessageSender: null,
        lastMessageTimestamp: new Date().toISOString(),
      };

      state.conversations.unshift(newConversation);
      state.activeConversationId = newConversation.clientId;
      state.messages = [];
    },
    newConversationCreated(state, action) {
      const newConversation = action.payload;
      const conversations = state.conversations;

      // if the conversation already exists in any manor
      // 1. client id matches. 2. conversation id matches. 3. other user id matches
      const existingConversation = conversations.find(
        (conv) =>
          conv?.clientId === newConversation?.clientId ||
          conv?._id === newConversation?._id ||
          conv?.otherUser?._id === newConversation?.otherUser?._id
      );

      // if it exists then replace it;
      if (existingConversation) {
        existingConversation._id = newConversation._id;
        existingConversation.createdBy = newConversation.createdBy;
      }
      // else, it is new, add it
      else {
        conversations.unshift(newConversation);
      }

      const activeConversation = getConversation(conversations, state.activeConversationId);
      // if the active conversation is the one that was just created
      if (
        state.activeConversationId === newConversation.clientId ||
        activeConversation?.otherUser?._id === newConversation?.otherUser?._id
      ) {
        state.activeConversationId = newConversation._id;
      }
    },
    updateUser(state, action) {
      const userId = action.payload.userId;
      let user;
      if (userId === state.user._id) {
        user = state.user;
      } else {
        const conversation = state.conversations.find((con) => con.otherUser._id === userId);
        user = conversation?.otherUser;
      }

      if (user) {
        let keys = ['email', 'name', 'isOnline', 'profileUrl', 'lastSeen'];
        for (let key in action.payload) {
          if (!keys.includes(key)) continue;
          user[key] = action.payload[key];
        }
      }
    },
    markAsDelivered(state, action) {
      // if it is the last of the conversation then update the lastMessage;
      const conversation = getConversation(state.conversations, action.payload.conversationId);
      if (
        conversation.lastMessage?.clientId === action.payload?.messageClientId ||
        conversation.lastMessage?._id === action.payload?.messageId
      ) {
        conversation.lastMessage.deliveredAt = action.payload?.deliveredAt;
      }
      // if it is the message of the active conversation then update the message;
      if (
        conversation._id === state.activeConversationId ||
        conversation.clientId === state.activeConversationId
      ) {
        const message = state.messages.find(
          (msg) =>
            msg.clientId === action.payload?.messageClientId ||
            msg._id === action.payload?.messageId
        );
        if (message) {
          message.deliveredAt = action.payload?.deliveredAt;
        }
      }
    },
    markAsRead(state, action) {
      // if it is the last message of the conversation then update the lastMessage;
      const conversation = getConversation(state.conversations, action.payload.conversationId);
      if (
        conversation.lastMessage?.clientId === action.payload?.messageClientId ||
        conversation.lastMessage?._id === action.payload?.messageId
      ) {
        conversation.lastMessage.readAt = action.payload?.readAt;
      }
      // if it is the message of the active conversation then update the message;
      if (
        conversation._id === state.activeConversationId ||
        conversation.clientId === state.activeConversationId
      ) {
        const message = state.messages.find(
          (msg) =>
            msg.clientId === action.payload?.messageClientId ||
            msg._id === action.payload?.messageId
        );
        message.readAt = action.payload?.readAt;
      }
      // if user is the recipient
      // if it is zero then set it to zero else reduce it by one
      if (action.payload.senderId !== state.user._id) {
        conversation.unseenCount -= conversation.unseenCount === 0 ? 0 : 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload; // Set fetched conversations
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch conversations';
      });
  },
});

export const {
  resetState,
  setUser,
  setActiveConversation,
  setMessages,
  sendMessage,
  receiveMessage,
  updateLastMessage,
  startNewIndividualChat,
  newConversationCreated,
  updateUser,
  markAsDelivered,
  markAsRead,
} = chatSlice.actions;
export default chatSlice.reducer;
