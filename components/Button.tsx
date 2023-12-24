export default function Button({ variant, children }: { variant?: 'secondary' | 'ghost' | 'danger', children: React.ReactNode }) {
  switch (variant) {
    case 'secondary':
      return <button className={`p-2 bg-background text-foreground border border-zinc-900 rounded-md cursor-pointer hover:bg-zinc-950 active:bg-zinc-900`}>{ children }</button>

    case 'ghost':
      return <button className={`p-2 bg-transparent text-foreground rounded-md cursor-pointer`}>{ children }</button>

    case 'danger':
      return <button className={`p-2 bg-red-600 text-background rounded-md cursor-pointer hover:bg-red-700 active:bg-red-800`}>{ children }</button>
  
    default:
      return <button className={`p-2 bg-foreground text-background rounded-md cursor-pointer hover:bg-slate-100 active:bg-slate-200`}>{ children }</button>
  }
}