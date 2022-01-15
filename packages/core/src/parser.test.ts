import parse from './parser'

describe('parser', () => {
  /**
   * export default function foo() {}
   */
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
  /**
   * function foo() {}
   *
   * export default foo
   */
  test('parses function statement correctly, when declared and exported separately', () => {
    const input = `
    function sumNumbers(
        /** @dozierParam First Number */ /** @maxValue 20 */ /** @minValue 5 */
        firstNumber: number,
        /** @dozierParam Second Number */ /** @maxValue 20 */ /** @minValue 5 */ /** @step 1 */
        secondNumber: number,
        ): number {
            return firstNumber + secondNumber
    }
    export default sumNumbers
    `
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
  /**
   * const foo = () => {}
   *
   * export default foo
   */
  test('parses function statement correctly when declared as arrow function and exported separately', () => {
    const input = `
    const deleteUser = async (userEmail: string) => {}
    export default deleteUser
    `
    const result = parse(input)
    expect(result).toEqual({
      functionName: 'deleteUser',
      params: [
        {
          identifier: 'userEmail',
          label: 'User email',
          required: true,
          type: 'string',
          meta: {},
        },
      ],
    })
  })
  /**
   * const foo = function() {}
   *
   * export default foo
   */
  test('parses function statement correctly when declared using a const and function expression and exported separately', () => {
    const input = `
    const deleteUser = async function(userEmail: string) {}
    export default deleteUser
    `
    const result = parse(input)
    expect(result).toEqual({
      functionName: 'deleteUser',
      params: [
        {
          identifier: 'userEmail',
          label: 'User email',
          required: true,
          type: 'string',
          meta: {},
        },
      ],
    })
  })
})
