import logo from '@/assets/logo.png';

export default function Banner() {
  return (
    <div
      className={
        'hidden h-full min-w-20 bg-neutral-100 sm:flex sm:flex-col sm:items-center sm:justify-center sm:gap-2'
      }
    >
      <img src={logo} width={250} alt='logo' />
      <p className='mt-3 text-lg text-slate-500'>Select user to send message</p>
    </div>
  );
}
