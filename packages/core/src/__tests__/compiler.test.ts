import { resolve } from 'path'
import compiler from '../compiler'

const rootFuncDir = resolve(__dirname, './__fixtures__/functions')

describe('compiler', () => {
  test('returns function routes correctly', async () => {
    const result = await compiler(rootFuncDir)
    expect(result).toEqual([
      { type: 'function', title: 'Ping', path: 'ping' },
      { type: 'function', title: 'Sum', path: 'sum' },
      {
        type: 'module',
        title: 'User',
        path: 'user',
        children: [
          { type: 'function', title: 'Fetch all users', path: 'user___fetch-all-users' },
          { type: 'function', title: 'Fetch user by email', path: 'user___fetch-user-by-email' },
          {
            type: 'module',
            title: 'Delete',
            path: 'user___delete',
            children: [{ type: 'function', title: 'Delete user', path: 'user___delete___delete-user' }],
          },
        ],
      },
    ])
  })
})
