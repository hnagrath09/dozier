import * as path from 'path'
import * as fs from 'fs/promises'
import { compile } from '../compiler'

const rootFuncDir = path.resolve(__dirname, './__fixtures__/functions')
const buildDir = path.resolve(__dirname, './__fixtures__/build')

describe('compiler', () => {
  afterEach(async () => {
    await fs.rm(buildDir, { recursive: true })
  })

  test('returns function routes correctly', async () => {
    const { routes } = await compile(rootFuncDir, buildDir)

    expect(routes).toEqual([
      {
        type: 'function',
        title: 'Ping',
        route: 'ping',
      },
      {
        type: 'function',
        title: 'Sum',
        route: 'sum',
      },
      {
        type: 'module',
        title: 'User',
        route: 'user',
        children: [
          {
            type: 'function',
            title: 'Fetch all users',
            route: 'user/fetch-all-users',
          },
          {
            type: 'function',
            title: 'Fetch user by email',
            route: 'user/fetch-user-by-email',
          },
          {
            type: 'module',
            title: 'Delete',
            route: 'user/delete',
            children: [
              {
                type: 'function',
                title: 'Delete user',
                route: 'user/delete/delete-user',
              },
            ],
          },
        ],
      },
    ])

    // check build file is present in the outdir
    const buildOutput = await fs.readdir(buildDir)
    expect(buildOutput).toEqual(['index.js'])
  })
})
