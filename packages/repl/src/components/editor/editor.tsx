import { useRef } from 'react'
import AceEditor from 'react-ace'
import useMeasure from 'react-use-measure'

import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-tomorrow_night'
import 'ace-builds/src-noconflict/snippets/typescript'

import useThemeContext from 'hooks/use-theme-context'

type EditorProps = {
  value: string
  onChange: (newValue: string) => void
}

export default function Editor({ value, onChange }: EditorProps) {
  const editorRef = useRef<AceEditor | null>(null)
  const [measure, containerbounds] = useMeasure()
  const { theme } = useThemeContext()

  return (
    <div className="h-full" ref={measure}>
      <AceEditor
        focus
        value={value}
        enableSnippets
        ref={editorRef}
        theme={theme === 'light' ? 'tomorrow' : 'tomorrow_night'}
        mode="typescript"
        showGutter={true}
        onChange={onChange}
        onLoad={(editor) => {
          editor.renderer.setPadding(10)
          editor.renderer.setScrollMargin(10, 10, 10, 10)
        }}
        enableLiveAutocompletion
        enableBasicAutocompletion
        width={`${containerbounds?.width ?? 0}px`}
        height={`${containerbounds?.height ?? 0}px`}
        setOptions={{
          fontSize: 14,
          showPrintMargin: false,
          fontFamily: '"Fira Code", monospace',
        }}
      />
    </div>
  )
}
