import { createSlice } from '@reduxjs/toolkit';

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
      state.conversations = action.payload;
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
    addConversation(state, action) {
      const newConversation = action.payload;

      //check if the conversation is exists
      const conversationIdx = state.conversations.findIndex((conv) => {
        return (
          conv?.clientId === newConversation?.clientId ||
          conv?._id === newConversation?._id ||
          (conv.type !== 'group' && conv?.otherUser?._id === newConversation?.otherUser?._id)
        );
      });
      // if the conversation is not exists
      if (conversationIdx === -1) {
        state.conversations.push(newConversation);
        state.messages = [];
      }
      // if the active conversation is the one that was just created
      const activeConversationId = state.activeConversationId;
      if (
        activeConversationId === newConversation.clientId ||
        activeConversationId === newConversation._id
      ) {
        state.activeConversationId = newConversation._id || newConversation.clientId;
      }
    },
    updateLastMessageOfConversation(state, action) {
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

      // if it is the recipient and the message is not for the active conversation
      if (
        newMessage.type !== 'system' &&
        newMessage.senderId !== state?.user?._id &&
        newMessage.conversationId !== state?.activeConversationId
      ) {
        if (conversation.unseenCount) {
          conversation.unseenCount++;
        } else {
          conversation.unseenCount = 1;
        }
      }
    },

    // message related reducers
    setMessages(state, action) {
      state.messages = action.payload;
    },
    sendMessage(state, action) {
      state.messages.push(action.payload);
    },
    addMessage(state, action) {
      const activeConversationId = state.activeConversationId;
      let prevMessages = state.messages;

      const newMessage = { ...action.payload };

      // if the conversation is not active, we don't need to update the messages
      if (newMessage.conversationId !== activeConversationId) {
        return;
      }

      const existingIndex = prevMessages.findIndex(
        (msg) =>
          msg.type !== 'system' &&
          (msg._id === newMessage._id || msg.clientId === newMessage.clientId)
      );
      if (existingIndex !== -1) {
        // free the URL object to avoid memory leaks
        let existingMessage = prevMessages[existingIndex];
        if (existingMessage?.media?.url?.startsWith('blob:')) {
          URL.revokeObjectURL(existingMessage.media.url);
        }
        prevMessages[existingIndex] = newMessage;
      } else {
        prevMessages.push(newMessage);
      }
      // if it is the recipient, mark the message as read
      if (state.user?._id !== newMessage?.senderId) {
        newMessage.readAt = new Date().toISOString();
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
  // user related actions
  setUser,
  updateUser,
  //conversation related actions
  setInitialConversations,
  setActiveConversation,
  addConversation,
  updateLastMessageOfConversation,

  // message related actions
  setMessages,
  sendMessage,
  addMessage,
  markAsDelivered,
  markAsRead,

  // group related actions
  groupEvents,
} = chatSlice.actions;
export default chatSlice.reducer;
