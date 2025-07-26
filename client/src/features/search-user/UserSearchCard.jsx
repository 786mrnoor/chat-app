import Avatar from '@/components/Avatar';

export default function UserSearchCard({ user, onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-full flex items-center gap-3 p-2 border border-transparent border-b-slate-200 rounded cursor-pointer hover:border-primary'
    >
      <Avatar size={50} user={user} className='flex-shrink-0' />
      <div className='text-left'>
        <h2 className='font-semibold text-ellipsis line-clamp-1'>{user?.name}</h2>
        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
    </button>
  );
}
