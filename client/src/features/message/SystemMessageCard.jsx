import { memo } from 'react';

import { generateSystemMessage } from '../../helpers/generate-system-message';

const SystemMessageCard = memo(function SystemMessageCard({ message, userId, members }) {
  const content = generateSystemMessage(message.meta, userId, members);

  return (
    <div className='self-center rounded-md bg-white text-center text-sm text-neutral-500'>
      <p className='px-2 whitespace-pre-wrap'>{content} </p>
    </div>
  );
});

export default SystemMessageCard;
