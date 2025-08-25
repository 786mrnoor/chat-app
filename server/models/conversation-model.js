import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    // Type of conversation: 'individual' for 1-on-1, 'group' for group chats
    type: {
      type: String,
      enum: ['individual', 'group'],
      required: true,
    },
    //temporary client-generated ID for optimistic UI updates
    clientId: {
      type: String,
      required: true,
    },
    // Name of the conversation (only required for group chats, e.g., "My Team Chat")
    name: {
      type: String,
      trim: true,
    },
    description: String,
    iconUrl: String,
    // Array of User IDs participating in this conversation
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'User' model
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastMessageTimestamp: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.type === 'group';
      }, // Only required for group chats
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ members: 1 });

// For individual conversations, ensure uniqueness based on members
// This prevents duplicate 1-on-1 conversations between the same two users.
// Note: This unique index requires members to be sorted consistently before saving
// (e.g., sort user IDs alphabetically before creating the conversation).
conversationSchema.index(
  { members: 1, type: 1 },
  { unique: true, partialFilterExpression: { type: 'individual' } }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
