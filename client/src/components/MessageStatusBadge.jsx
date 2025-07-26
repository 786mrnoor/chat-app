import { CiClock2 } from 'react-icons/ci';
import { IoCheckmarkDone, IoCheckmarkSharp } from 'react-icons/io5';

export default function MessageStatusBadge({ message, size = 10 }) {
  if (message?.readAt) return <IoCheckmarkDone size={size} className='inline text-primary' />;
  if (message?.deliveredAt) return <IoCheckmarkDone size={size} className='inline' />;
  if (!message?.status) return <IoCheckmarkSharp size={size} className='inline' />;
  return <CiClock2 size={size} className='inline' />;
}
