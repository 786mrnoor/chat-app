import ProgressSpinner from '@/components/ProgressSpinner';

export default function MediaMessage({ message }) {
  console.log('message', message);

  return (
    <div className='relative bg-white'>
      {message?.type === 'image' && (
        <img
          src={message?.media?.url}
          className='gradient h-auto min-w-full'
          alt={message?.content}
          loading='lazy'
          height={message?.media?.height}
          width={message?.media?.width}
        />
      )}
      {message?.type === 'video' && (
        <video
          src={message.media?.url}
          height={message?.media?.height}
          width={message?.media?.width}
          className='h-full w-full object-scale-down'
          controls
        />
      )}
      {message.media?.status && (
        <div className='absolute top-1/2 left-1/2 aspect-square h-15 -translate-1/2 rounded-full bg-black/50 text-[.8rem]'>
          {message.media?.status === 'uploading' && (
            <ProgressSpinner
              size={60}
              stroke={5}
              progress={message.media?.progress}
              className='text-primary'
            />
          )}
          <span className='absolute top-1/2 left-1/2 -translate-1/2 text-white'>
            {message.media?.status === 'uploading'
              ? `${message.media?.progress ?? 0}%`
              : message.media?.status === 'failed'
                ? 'Failed'
                : 'Done'}
          </span>
        </div>
      )}
    </div>
  );
}
