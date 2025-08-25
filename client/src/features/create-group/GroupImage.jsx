import { FaUsers } from 'react-icons/fa';
import { GrGallery } from 'react-icons/gr';

export default function GroupImage({ imageUrl, setImage }) {
  return (
    <label
      htmlFor='image'
      tabIndex='0'
      className='relative cursor-pointer rounded-full bg-neutral-100'
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt='Group'
          width={80}
          height={80}
          className='h-[80px] w-[80px] rounded-full object-cover'
        />
      ) : (
        <>
          <FaUsers size={80} className='fill-primary' />
          <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/30 text-white'>
            <GrGallery size={20} />
            <span className='text-center'>Add group icon</span>
          </div>
        </>
      )}

      <input
        type='file'
        id='image'
        accept='image/*'
        multiple
        onChange={setImage}
        className='hidden'
      />
    </label>
  );
}
