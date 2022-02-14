import * as path from 'path'
import * as esbuild from 'esbuild'
import type { Route } from './route'
import { getFunctionRoutes, getRouteVariable } from './route'

export async function compileProgram(rootDir: string, outputDir: string, routes: Route[]) {
  const functionRoutes = getFunctionRoutes(routes)
  // import all the functions in the entryFile and export all the named imports using functions variable
  const entryFile = `${functionRoutes
    .map(({ route }) => `import * as ${getRouteVariable(route)} from './${route}'`)
    .join('\n')}

  export const functions = {
    ${functionRoutes.map(({ route }) => `${getRouteVariable(route)}`).join(',\n')}
  }`

  return await esbuild.build({
    stdin: {
      contents: entryFile,
      resolveDir: rootDir,
    },
    format: 'cjs',
    logLevel: 'silent',
    outfile: path.resolve(outputDir, 'index.js'),
    bundle: true,
  })
}
