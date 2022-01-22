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
        params: [
          {
            identifier: 'name',
            label: 'Name',
            type: 'string',
            required: true,
            meta: {},
          },
        ],
      },
      {
        type: 'function',
        title: 'Sum',
        route: 'sum',
        params: [
          {
            identifier: 'first',
            label: 'First',
            type: 'number',
            required: true,
            meta: {
              maxValue: undefined,
              minValue: undefined,
              step: undefined,
            },
          },
          {
            identifier: 'second',
            label: 'Second',
            type: 'number',
            required: true,
            meta: {
              maxValue: undefined,
              minValue: undefined,
              step: undefined,
            },
          },
        ],
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
            params: [
              {
                identifier: 'id',
                label: 'Id',
                type: 'string',
                required: true,
                meta: {},
              },
              {
                identifier: 'date',
                label: 'Date of Birth',
                type: 'date',
                required: true,
                meta: {
                  maxDate: 'now',
                  minDate: undefined,
                },
              },
              {
                identifier: 'height',
                label: "Person's Height",
                type: 'number',
                required: false,
                meta: {
                  maxValue: 40,
                  minValue: 20,
                  step: 5,
                },
              },
            ],
          },
          {
            type: 'function',
            title: 'Fetch user by email',
            route: 'user/fetch-user-by-email',
            params: [
              {
                identifier: 'email',
                label: 'Email',
                type: 'string',
                required: true,
                meta: {},
              },
            ],
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
                params: [
                  {
                    identifier: 'userEmail',
                    label: 'User email',
                    type: 'string',
                    required: true,
                    meta: {},
                  },
                ],
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
