import uniqueId from '@/helpers/unique-id';

export function createOptimisticMessage(senderId, type = 'text', content, media) {
  return {
    senderId,
    type,
    content: content?.trim() || '',
    media,
    clientId: uniqueId(),
    createdAt: new Date().toISOString(),
    status: 'sending',
  };
}
