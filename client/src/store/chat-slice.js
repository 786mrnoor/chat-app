import { createSlice } from '@reduxjs/toolkit';

import uniqueId from '@/helpers/unique-id';

import { generateSystemMessage } from '../helpers/generate-system-message';

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
    // user related reducers
    setUser(state, action) {
      state.user = action.payload;
    },
    updateUser(state, action) {
      const userId = action.payload.userId;
      let user;
      if (userId === state.user._id) {
        user = state.user;
      } else {
        const conversation = state.conversations.find((con) => con?.otherUser?._id === userId);
        user = conversation?.otherUser;
      }

      if (user) {
        let keys = ['email', 'name', 'isOnline', 'profileUrl', 'lastSeen', 'isTyping'];
        for (let key in action.payload) {
          if (!keys.includes(key)) continue;
          user[key] = action.payload[key];
        }
      }
    },

    //conversation related reducers
    setInitialConversations(state, action) {
      state.conversations = action.payload?.map((conv) => {
        //if lastmessage is system message then genrate content
        if (conv.type === 'group' && conv.lastMessage?.type === 'system') {
          const content = generateSystemMessage(
            conv?.lastMessage?.meta,
            state.user._id,
            conv?.members
          );
          conv.lastMessage.content = content;
        }
        return conv;
      });
    },
    setActiveConversation(state, action) {
      const conversationId = action.payload;
      if (state.activeConversationId === conversationId) return;
      state.activeConversationId = conversationId;
      state.messages = [];

      if (!conversationId) return;

      // update unseen count;
      const conversation = getConversation(state.conversations, conversationId);
      conversation.unseenCount = 0;
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
        lastMessageSender: null,
        lastMessageTimestamp: new Date().toISOString(),
      };

      state.conversations.push(newConversation);
      state.activeConversationId = newConversation.clientId;
      state.messages = [];
    },
    startNewConversation(state, action) {
      const newConversation = action.payload;

      // if newConversation is a group and last message is system message then genrate content
      if (newConversation.type === 'group' && newConversation.lastMessage?.type === 'system') {
        const content = generateSystemMessage(
          newConversation?.lastMessage?.meta,
          state.user?._id,
          newConversation?.members
        );
        newConversation.lastMessage.content = content;
      }

      state.conversations.push(newConversation);
      state.activeConversationId = newConversation._id || newConversation.clientId;
      state.messages = [];
    },
    newConversationCreated(state, action) {
      const newConversation = action.payload;
      // if the conversation already exists in any manor
      // 1. client id matches. 2. conversation id matches. 3. other user id matches
      if (newConversation?.lastMessage?.type === 'system') {
        const content = generateSystemMessage(
          newConversation?.lastMessage?.meta,
          state.user?._id,
          newConversation?.members
        );
        newConversation.lastMessage.content = content;
      }
      const idx = state.conversations.findIndex((conv) => {
        return (
          conv?.clientId === newConversation?.clientId ||
          conv?._id === newConversation?._id ||
          (conv.type !== 'group' && conv?.otherUser?._id === newConversation?.otherUser?._id)
        );
      });

      if (idx !== -1) {
        state.conversations[idx] = {
          ...state.conversations[idx],
          ...newConversation,
        };
      } else {
        // New one → push
        state.conversations.push(newConversation);
      }

      const activeConversation = getConversation(state.conversations, state.activeConversationId);
      // if the active conversation is the one that was just created
      if (
        state.activeConversationId === newConversation.clientId ||
        (activeConversation?.type === 'individual' &&
          activeConversation?.otherUser?._id === newConversation?.otherUser?._id)
      ) {
        state.activeConversationId = newConversation._id;
      }
    },

    // message related reducers
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
      if (
        newMessage.type !== 'system' &&
        newMessage.senderId !== userId &&
        newMessage.conversationId !== activeConversationId
      ) {
        const conversation = getConversation(state.conversations, newMessage.conversationId);
        if (conversation.unseenCount) {
          conversation.unseenCount++;
        } else {
          conversation.unseenCount = 1;
        }
      }
      // if the conversation is not active, we don't need to update the messages
      if (newMessage.conversationId !== activeConversationId) {
        return;
      }

      // if the sender is the current user
      if (newMessage.senderId === userId) {
        const existingIndex = prevMessages.findIndex(
          (msg) => msg.type !== 'system' && msg.clientId === newMessage.clientId
        );
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

      if (newMessage.type === 'system') {
        newMessage.content = generateSystemMessage(
          newMessage?.meta,
          state.user?._id,
          conversation?.members
        );
      }
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
    markAsDelivered(state, action) {
      // if it is the last of the conversation then update the lastMessage;
      const conversation = getConversation(state.conversations, action.payload?.conversationId);
      if (
        conversation?.lastMessage?.clientId === action?.payload?.messageClientId ||
        conversation?.lastMessage?._id === action.payload?.messageId
      ) {
        conversation.lastMessage.deliveredAt = action.payload?.deliveredAt;
      }
      // if it is the message of the active conversation then update the message;
      if (
        conversation._id === state.activeConversationId ||
        conversation.clientId === state.activeConversationId
      ) {
        state.messages.forEach((msg) => {
          if (
            msg.clientId === action.payload?.messageClientId ||
            msg._id === action.payload?.messageId
          ) {
            msg.deliveredAt = action.payload?.deliveredAt;
          }
        });
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
        state.messages.forEach((msg) => {
          if (
            msg.clientId === action.payload?.messageClientId ||
            msg._id === action.payload?.messageId
          ) {
            msg.readAt = action.payload?.readAt;
          }
        });
      }
      // if user is the recipient
      // if it is zero then set it to zero else reduce it by one
      if (action.payload.senderId !== state.user._id) {
        conversation.unseenCount -= conversation.unseenCount === 0 ? 0 : 1;
      }
    },

    // group events
    groupEvents(state, action) {
      const { groupId, updates } = action.payload;
      const group = getConversation(state.conversations, groupId);

      if (updates.iconUrl) {
        group.iconUrl = updates.iconUrl;
      }
    },
  },
});

export const {
  resetState,
  setUser,
  setInitialConversations,
  setActiveConversation,
  setMessages,
  sendMessage,
  receiveMessage,
  updateLastMessage,
  startNewIndividualChat,
  startNewConversation,
  newConversationCreated,
  updateUser,
  markAsDelivered,
  markAsRead,
  groupEvents,
} = chatSlice.actions;
export default chatSlice.reducer;
