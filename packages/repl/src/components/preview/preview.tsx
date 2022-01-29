import { Button, Empty, Form, Input } from 'antd'
import { CheckOutlined, ClearOutlined } from '@ant-design/icons'
import { FunctionParams } from '@dozier/core'

type PreviewProps = {
  error: string | undefined
  params: { params: FunctionParams[] }
}

export default function Preview({ error, params }: PreviewProps) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-white border-l dark:border-gray-400 dark:bg-stone-700">
      <div className="flex flex-col items-center justify-center flex-1 space-y-4">
        {(() => {
          if (error) {
            return (
              <pre className="w-full max-w-lg p-4 mx-auto font-mono text-xs font-medium text-red-300 bg-gray-800 rounded-md dark:border dark:border-gray-400">
                <code className="break-words break-all">{JSON.stringify(error, null, 2)}</code>
              </pre>
            )
          } else {
            return (
              <>
                <div className="w-full max-w-xl p-4 mx-auto bg-white rounded-md shadow dark:border dark:border-gray-400 dark:bg-stone-800">
                  <div className="text-base font-medium text-gray-700 dark:text-gray-100">Function Title</div>
                  <div className="text-sm text-gray-600 dark:text-gray-200">
                    Some nice description about the function
                  </div>
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
                    <Button icon={<CheckOutlined />} className="!mr-4" type="primary">
                      Submit
                    </Button>
                    <Button icon={<ClearOutlined />} htmlType="reset">
                      Reset
                    </Button>
                  </Form>
                </div>

                <div className="w-full max-w-xl p-4 mx-auto rounded-md shadow dark:border dark:border-gray-400 dark:text-gray-100 dark:bg-stone-800">
                  <Empty description="Run the function to see result" />
                </div>
              </>
            )
          }
        })()}
      </div>
    </div>
  )
}
