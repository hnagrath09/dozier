import { FunctionParams } from '@dozier/core'

type PreviewProps = {
  params: { params: FunctionParams[] } | string
}

export default function Preview({ params }: PreviewProps) {
  return (
    <div className="flex-1">
      <pre className="max-w-sm p-4 mx-auto font-mono text-xs text-white bg-gray-800 rounded-md">
        <code className="break-words break-all">{JSON.stringify(params, null, 2)}</code>
      </pre>
    </div>
  )
}
