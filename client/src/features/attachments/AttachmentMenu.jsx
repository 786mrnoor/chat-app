import { FaImage, FaVideo } from 'react-icons/fa6';

export default function AttachmentMenu({ onAttachmentSelect }) {
  function handleSelect(e) {
    const files = e.target.files;
    if (files.length <= 0) return;

    onAttachmentSelect(e.target.name, files);
  }
  return (
    <div className='bg-slate-100 border border-slate-200 shadow rounded absolute bottom-14 w-42 p-2'>
      <form>
        <input
          name='image'
          type='file'
          multiple={true}
          id='uploadImage'
          onChange={handleSelect}
          className='hidden'
        />

        <input
          name='video'
          type='file'
          id='uploadVideo'
          onChange={handleSelect}
          className='hidden'
        />
        <label
          htmlFor='uploadImage'
          className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'
        >
          <FaImage size={18} className='text-primary' />
          <span>Image</span>
        </label>
        <label
          htmlFor='uploadVideo'
          className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'
        >
          <FaVideo size={18} className='text-purple-500' />
          <span>Video</span>
        </label>
      </form>
    </div>
  );
}
