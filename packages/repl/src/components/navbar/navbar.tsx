import { ReactComponent as Logo } from '../../assets/favicon.svg'

export default function Navbar() {
  return (
    <nav className="flex items-center w-full px-6 py-4 bg-gray-800 border-b border-gray-400">
      <Logo className="w-5 h-5 mr-3" />
      <span className="font-mono text-base font-semibold text-gray-100">Dozier REPL</span>
    </nav>
  )
}
