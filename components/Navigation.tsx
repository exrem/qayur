import Link from 'next/link'
import { Bars2Icon } from '@heroicons/react/16/solid'

export default function Navigation() {
  return (
    <>
      <nav className='flex justify-between items-center py-3 px-6 border-b border-zinc-800 xl:hidden'>
        <Link className='font-medium' href='/'>Qäyur Bot</Link>
        <Bars2Icon className='w-5 cursor-pointer' />
      </nav>
      <nav className='hidden justify-center items-center gap-8 py-3 px-6 border-b border-zinc-800 xl:flex'>
        <Link className='font-medium' href='/'>Qäyur Bot</Link>
        <Link className='underline-offset-4 hover:underline' href='/about'>About</Link>
        <Link className='underline-offset-4 hover:underline' href='/about'>Tasks</Link>
      </nav>
    </>
  )
}