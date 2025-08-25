import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { useSocket } from '@/contexts/SocketContext';

import { reduceChatAvatar } from '@/helpers/reduce-image';
import uniqueId from '@/helpers/unique-id';
import { getSignatureWithFormData } from '@/lib/cloudinary';
import { startNewConversation } from '@/store/chat-slice';

export default function useGroupCreater(onClose) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const socket = useSocket();

  async function createGroup(data) {
    try {
      if (!data.name) {
        return;
      }
      setLoading(true);

      //emit create-group
      const groupResponse = await socket.timeout(10000).emitWithAck('group:create', {
        clientId: uniqueId(),
        name: data.name,
        description: data.description,
        members: data.members.map((m) => m._id),
      });
      if (groupResponse.error) {
        throw new Error(groupResponse.message);
      }

      dispatch(startNewConversation(groupResponse.data));
      toast.success('Group created successfully');
      setLoading(false);
      onClose();

      //reduce image
      const reducedImage = await reduceChatAvatar(data.imageUrl, data?.image?.type);
      URL.revokeObjectURL(data.imageUrl);

      // get signature
      const [formData, uploadUrl] = await getSignatureWithFormData(
        'group-avatar',
        groupResponse.data._id
      );

      formData.append('file', reducedImage);
      //upload group photo
      const { data: uploadResponse } = await axios.post(uploadUrl, formData);

      //update group
      const res = await socket
        .timeout(10000)
        .emitWithAck('group:events', groupResponse.data._id, 'group_photo_change', {
          iconUrl: uploadResponse.secure_url,
        });
      if (res.error) {
        toast.error(res.message || 'Failed to upload group photo');
      } else {
        toast.success('Group photo updated!');
      }
      // update the state
    } catch (error) {
      setLoading(false);
      console.error('Error creating group:', error);
      toast.error(error.message || 'Failed to create group');
    }
  }

  return [createGroup, loading];
}
