import { useState } from 'react'
import { parse } from '@dozier/core'

import Editor from './components/editor'
import Preview from './components/preview'
import Navbar from './components/navbar'

const input = `const sumNumbers = (firstNumber: number, secondNumber: number) => {
  return a + b;
}

export default sumNumbers;
`

export default function App() {
  const [value, setValue] = useState(input)
  const [params, setParams] = useState(parse(input))
  const [error, setError] = useState<string | undefined>()

  function handleChange(newValue: string) {
    setValue(newValue)
    try {
      setParams(parse(newValue))
      if (error) {
        setError(undefined)
      }
    } catch (error: any) {
      setError(`error: ${error.message}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <Navbar />
      <div className="flex items-center justify-center flex-1 w-full">
        <Editor value={value} onChange={handleChange} />
        <Preview params={params} error={error} />
      </div>
    </div>
  )
}
