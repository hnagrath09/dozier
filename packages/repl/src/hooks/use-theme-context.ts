import { useContext } from 'react'
import ThemeContext from 'context/theme'

export default function useThemeContext() {
  const value = useContext(ThemeContext)
  if (value === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return value
}
