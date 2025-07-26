// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';

import chatReducer from './chat-slice';

export const store = configureStore({
  reducer: chatReducer,

  // Optional: Add middleware or enhancers here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values for specific actions or paths
        // For example, if you store socket instances directly in Redux (not recommended)
        // Or if Dates are not handled properly (Mongoose returns Date objects)
        ignoredPaths: [
          'conversations.conversations.lastMessage.timestamp',
          'messages.messages.createdAt',
          'messages.messages.deliveredAt',
          'messages.messages.readAt',
          'conversations.conversations.createdAt',
          'conversations.conversations.updatedAt',
          'conversations.conversations.lastMessageTimestamp',
        ],
      },
    }),
});
