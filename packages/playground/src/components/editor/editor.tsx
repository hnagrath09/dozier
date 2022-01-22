import AceEditor from 'react-ace'
import useMeasure from 'react-use-measure'

import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/theme-monokai'

type EditorProps = {
  value: string
  onChange: (newValue: string) => void
}

export default function Editor({ value, onChange }: EditorProps) {
  const [measure, containerbounds] = useMeasure()

  return (
    <div className="flex-1 h-full" ref={measure}>
      <AceEditor
        value={value}
        theme="monokai"
        mode="typescript"
        onChange={onChange}
        width={`${containerbounds?.width ?? 0}px`}
        height={`${containerbounds?.height ?? 0}px`}
        setOptions={{
          fontSize: 14,
          showPrintMargin: false,
        }}
      />
    </div>
  )
}
