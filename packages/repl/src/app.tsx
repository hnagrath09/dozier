import { useState } from 'react'
import SplitPane from 'react-split-pane'
import { parse } from '@dozier/core'

import Editor from 'components/editor'
import Preview from 'components/preview'
import Navbar from 'components/navbar'

const input = `export default function sumNumbers(
  /** @dozierParam First number */ /** @minValue 0 */
  a: number, 
  /** @dozierParam Second number */ /** @minValue 0 */
  b: number) {
  return a + b;
}
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
      <div className="relative flex-1 w-full">
        <SplitPane split="vertical" defaultSize="50%">
          <Editor value={value} onChange={handleChange} />
          <Preview params={params} error={error} />
        </SplitPane>
      </div>
    </div>
  )
}
