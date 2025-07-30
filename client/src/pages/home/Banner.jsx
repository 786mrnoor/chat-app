import logo from '@/assets/logo.png';

export default function Banner() {
  return (
    <div className='h-full min-w-20 flex-col items-center justify-center gap-2 bg-neutral-100 sm:flex'>
      <img src={logo} width={250} alt='logo' />
      <p className='mt-3 text-lg text-slate-500'>Select user to send message</p>
    </div>
  );
}
