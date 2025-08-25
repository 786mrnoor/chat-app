import { PiUserCircle } from 'react-icons/pi';

export default function Avatar({ size, imageUrl, user, className }) {
  return (
    <div
      className={`relative rounded-full font-bold text-slate-800 ${className}`}
      style={{ width: size + 'px', height: size + 'px' }}
    >
      {imageUrl || user?.profileUrl ? (
        <img
          src={imageUrl || user?.profileUrl}
          width={size}
          height={size}
          alt={user?.name}
          className='overflow-hidden rounded-full object-cover'
          style={{ width: size + 'px', height: size + 'px' }}
          loading='lazy'
        />
      ) : (
        <PiUserCircle className='fill-primary' size={size} />
      )}

      {user?.isOnline && (
        <div className='absolute -right-1 bottom-2 rounded-full bg-green-600 p-1'></div>
      )}
    </div>
  );
}
