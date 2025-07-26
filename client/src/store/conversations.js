import { createAsyncThunk } from '@reduxjs/toolkit';

import authAxios from '@/lib/auth-axios';

// Async Thunk to fetch conversations
export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (_, { __, rejectWithValue }) => {
    try {
      const response = await authAxios.get(`/api/conversation`);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch conversations:', err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
