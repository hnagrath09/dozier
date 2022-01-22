import { useState } from 'react'
import { parse, FunctionParams } from '@dozier/core'
import Editor from './components/editor'
import Preview from './components/preview'

const input = `const foo = (a: number, b: number) => {
  return a + b;
}

export default foo;
`

export default function App() {
  const [value, setValue] = useState(input)
  const [params, setParams] = useState<{ params: FunctionParams[] } | string>(parse(input))

  function handleChange(newValue: string) {
    setValue(newValue)
    try {
      setParams(parse(newValue))
    } catch (error: any) {
      setParams(`error: ${error.message}`)
    }
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Editor value={value} onChange={handleChange} />
      <Preview params={params} />
    </div>
  )
}
