import { Button } from 'antd'
import { ReactComponent as Logo } from '../../assets/favicon.svg'
import { ReactComponent as Sun } from '../../assets/sun.svg'
import useThemeContext from '../../hooks/use-theme-context'

export default function Navbar() {
  const { setTheme } = useThemeContext()

  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <nav className="flex items-center flex-none w-full px-6 py-3 bg-white border-b border-gray-400 dark:bg-gray-800">
      <Logo className="w-5 h-5 mr-3" />
      <span className="font-mono text-base font-semibold text-gray-700 dark:text-gray-100">Dozier REPL</span>
      <div className="flex-1" />
      <Button type="ghost" icon={<Sun className="w-6 h-6" />} onClick={toggleTheme} />
    </nav>
  )
}
