import { FaImage, FaVideo } from 'react-icons/fa6';

export default function AttachmentMenu({ onAttachmentSelect }) {
  function handleSelect(e) {
    let files = e.target.files;
    if (files.length <= 0) return;
    let type = e.target.name;
    files = Array.from(files).filter((f) => f?.type?.startsWith(type));

    onAttachmentSelect(type, files);
  }
  return (
    <div className='absolute bottom-14 w-42 rounded border border-slate-200 bg-slate-100 p-2 shadow'>
      <form>
        <input
          name='image'
          type='file'
          multiple={true}
          id='uploadImage'
          onChange={handleSelect}
          accept='image/*'
          className='hidden'
        />

        <input
          name='video'
          type='file'
          multiple={true}
          id='uploadVideo'
          onChange={handleSelect}
          accept='video/*'
          className='hidden'
        />
        <label
          htmlFor='uploadImage'
          className='flex cursor-pointer items-center gap-3 p-2 px-3 hover:bg-slate-200'
        >
          <FaImage size={18} className='text-primary' />
          <span>Image</span>
        </label>
        <label
          htmlFor='uploadVideo'
          className='flex cursor-pointer items-center gap-3 p-2 px-3 hover:bg-slate-200'
        >
          <FaVideo size={18} className='text-purple-500' />
          <span>Video</span>
        </label>
      </form>
    </div>
  );
}
