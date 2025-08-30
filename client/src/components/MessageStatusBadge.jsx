import { CiClock2 } from 'react-icons/ci';
import { IoCheckmarkDone, IoCheckmarkSharp } from 'react-icons/io5';

export default function MessageStatusBadge({ message, size = 10, className = '' }) {
  if (message?.readAt)
    return <IoCheckmarkDone size={size} className={`inline text-primary ${className}`} />;
  if (message?.deliveredAt)
    return <IoCheckmarkDone size={size} className={`inline ${className}`} />;
  if (!message?.status) return <IoCheckmarkSharp size={size} className={`inline ${className}`} />;
  return <CiClock2 size={size} className={`inline ${className}`} />;
}
