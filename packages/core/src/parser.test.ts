import parse from './parser'

describe('parser', () => {
  test('parses export default function statement correctly', () => {
    const input = `
    export default function sumNumbers(
        /** @dozierParam First Number */ /** @maxValue 20 */ /** @minValue 5 */
        firstNumber: number,
        /** @dozierParam Second Number */ /** @maxValue 20 */ /** @minValue 5 */ /** @step 1 */
        secondNumber: number,
        ): number {
            return firstNumber + secondNumber
    }`
    const result = parse(input)
    expect(result).toEqual({
      functionName: 'sumNumbers',
      params: [
        {
          identifier: 'firstNumber',
          label: 'First Number',
          required: true,
          type: 'number',
          meta: {
            minValue: 5,
            maxValue: 20,
          },
        },
        {
          identifier: 'secondNumber',
          label: 'Second Number',
          required: true,
          type: 'number',
          meta: {
            minValue: 5,
            maxValue: 20,
            step: 1,
          },
        },
      ],
    })
  })
})
