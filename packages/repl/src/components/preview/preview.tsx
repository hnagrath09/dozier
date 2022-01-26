import { Button, Empty, Form, Input } from 'antd'
import { CheckOutlined, ClearOutlined } from '@ant-design/icons'
import { FunctionParams } from '@dozier/core'

type PreviewProps = {
  error: string | undefined
  params: { params: FunctionParams[] }
}

export default function Preview({ error, params }: PreviewProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full space-y-4 border-l border-gray-400 bg-stone-700">
      {(() => {
        if (error) {
          return (
            <pre className="w-full max-w-lg p-4 mx-auto font-mono text-xs font-medium text-red-300 bg-gray-800 border border-gray-400 rounded-md">
              <code className="break-words break-all">{JSON.stringify(error, null, 2)}</code>
            </pre>
          )
        } else {
          return (
            <>
              <div className="w-full max-w-2xl p-4 mx-auto text-gray-100 border border-gray-400 rounded-md shadow bg-stone-800">
                <div className="text-base font-medium">Function Title</div>
                <div className="text-sm text-gray-200">Some nice description about the function</div>
                <hr className="my-4 -mx-4 border-gray-400" />
                <Form layout="vertical">
                  {params.params.map((param) => {
                    return (
                      <Form.Item
                        label={param.label}
                        key={param.identifier}
                        name={param.identifier}
                        required={param.required}
                      >
                        {(() => {
                          switch (param.type) {
                            case 'string':
                              return <Input />
                            case 'number': {
                              const { maxValue, minValue, step } = param.meta
                              return <Input type="number" max={maxValue} min={minValue} step={step} />
                            }
                          }
                        })()}
                      </Form.Item>
                    )
                  })}
                  <Button icon={<CheckOutlined />} className="mr-4">
                    Submit
                  </Button>
                  <Button icon={<ClearOutlined />} htmlType="reset">
                    Reset
                  </Button>
                </Form>
              </div>

              <div className="w-full max-w-2xl p-4 mx-auto text-gray-100 border border-gray-400 rounded-md shadow bg-stone-800">
                <Empty description="Run the function to see result" />
              </div>
            </>
          )
        }
      })()}
    </div>
  )
}
