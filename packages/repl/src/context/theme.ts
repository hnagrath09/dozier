import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'

const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  setTheme: Dispatch<SetStateAction<'light' | 'dark'>>
}>({
  theme: 'light',
  setTheme: () => {},
})

export default ThemeContext
