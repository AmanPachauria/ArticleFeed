import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md text-white'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/' className='text-white'>
          <h1 className='font-bold text-lg sm:text-2xl flex flex-wrap'>
            <span className='text-yellow-300'>Article</span>
            <span className='text-yellow-500'>Feed</span>
          </h1>
        </Link>
        <ul className='flex gap-4'>
          <Link to='/' className='text-white hover:underline'>
            <li className='hidden sm:inline'>Home</li>
          </Link>
          <Link to='/about' className='text-white hover:underline'>
            <li className='hidden sm:inline'>About</li>
          </Link>
          <Link to='/sign-in' className='text-white hover:underline'>
            <li>Sign in</li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
