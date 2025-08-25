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
      validate: {
        validator: function (v) {
          if (this.type === 'system') return true;
          return !!v;
        },
        message: 'Client ID is required for messages other than systems.',
      },
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
          if (this.type === 'text') return !!v;
          return true;
        },
        message: 'Content is required for text messages.',
      },
    },
    media: {
      url: String,
      width: Number,
      height: Number,
      publicId: String, // optional, useful for deletion/overwrite
    },
    meta: {
      type: { type: String },
      actorId: mongoose.Schema.Types.ObjectId, // person who performed the action
      targetId: mongoose.Schema.Types.ObjectId, // person affected by the action
      groupName: String, // name of the group (if applicable)
      newName: String, // new group name
    },
    deliveredAt: Date,
    readAt: Date,
  },
  {
    timestamps: true,
  }
);

// Add an index to efficiently query messages for a specific conversation, ordered by timestamp
messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
