import ProfileCard from '@/components/ProfileCard';

export default function GeneralProfileCard({ user, onClick, className }) {
  return (
    <ProfileCard user={user} onClick={onClick} className={className}>
      <div className='text-left'>
        <h2 className='line-clamp-1 font-semibold text-ellipsis'>{user?.name}</h2>
        <p className='line-clamp-1 text-sm text-ellipsis'>{user?.email}</p>
      </div>
    </ProfileCard>
  );
}
