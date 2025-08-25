import Avatar from '@/components/Avatar';

export default function ProfileCard({ user, onClick, imageUrl, children, className = '' }) {
  return (
    <>
      <button onClick={onClick} className={`profile-card ${className}`}>
        <Avatar imageUrl={imageUrl} user={user} size={42} className='flex-shrink-0' />
        {children}
      </button>
      <hr className='border-neutral-200' />
    </>
  );
}
