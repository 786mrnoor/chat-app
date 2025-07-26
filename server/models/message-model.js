import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    //temporary client-generated ID for optimistic UI updates
    // This allows the frontend to match its pending message with the definitive one from the server
    clientId: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'file', 'system'], // 'system' for joins/leaves
      default: 'text',
    },
    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      validate: {
        validator: function (v) {
          if (['text', 'system'].includes(this.type)) return !!v;
          return true;
        },
        message: 'Content is required for text and system messages.',
      },
    },
    media: {
      url: String,
      width: Number,
      height: Number,
      publicId: String, // optional, useful for deletion/overwrite
    },
    deliveredAt: {
      type: Date,
      default: null, // No default value, so it's null until set
    },
    readAt: {
      type: Date,
      default: null, // No default value, so it's null until set
    },
  },
  {
    timestamps: true,
  }
);

// Add an index to efficiently query messages for a specific conversation, ordered by timestamp
messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
