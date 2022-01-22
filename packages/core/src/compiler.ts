/**
 * Compiler recursively reads all the files and folders in the given directory
 * and returns a list of paths that can be used to generate the dozier client.
 *
 * @param: rootDirPath - The path to the directory that contains all the files and folders
 * @returns: A list of paths that can be used to generate the dozier client
 *
 * @example:
 * compile('./__fixtures__/functions') will return something like:
 * [
 *  {type: 'function', title: 'ping', path: 'ping'},
 *  {
 *      type: 'module', title: 'user', path: 'user',
 *      children: [{type: 'function', title: 'fetch all users', path: 'user___fetch-all-users'}]
 *  }
 * ]
 */

import * as path from 'path'
import * as fs from 'fs/promises'
import type { Route } from './route'
import { resolveRoute, getRouteTitle } from './route'
import { compileProgram } from './program'
import { parse } from './parser'

async function isDir(path: string): Promise<boolean> {
  const stat = await fs.lstat(path)
  return stat.isDirectory()
}

async function compileRoutes(rootDirPath: string, rootDirName?: string): Promise<Route[]> {
  const routes: Route[] = []

  const dirContent = await fs.readdir(rootDirPath)

  const files: string[] = []
  const folders: string[] = []

  // segregate files and folders
  for (const item of dirContent) {
    if (item.endsWith('.ts')) {
      const fileContent = await fs.readFile(path.resolve(rootDirPath, item), 'utf8')
      if (!fileContent.trim().startsWith('/** @dozier-ignore */')) {
        files.push(item)
      }
    } else {
      const isItemDir = await isDir(path.resolve(rootDirPath, item))
      if (isItemDir) {
        folders.push(item)
      }
    }
  }

  // sort files and folders alphabetically
  files.sort()
  folders.sort()

  // compile files
  for (const file of files) {
    const fileName = file.replace('.ts', '')
    const fileContent = await fs.readFile(path.resolve(rootDirPath, file), 'utf8')
    routes.push({
      type: 'function',
      title: getRouteTitle(fileName),
      route: resolveRoute(fileName, rootDirName),
      params: parse(fileContent).params,
    })
  }

  for (const folder of folders) {
    const folderName = typeof rootDirName !== 'undefined' ? `${rootDirName}/${folder}` : folder
    const folderPath = path.resolve(rootDirPath, folder)
    const folderChildrenPaths = await compileRoutes(folderPath, folderName)
    if (folderChildrenPaths.length > 0) {
      routes.push({
        type: 'module',
        title: getRouteTitle(folder),
        route: resolveRoute(folder, rootDirName),
        children: folderChildrenPaths,
      })
    }
  }

  return routes
}

export async function compile(rootDir: string, outputDir: string): Promise<{ routes: Route[] }> {
  const routes = await compileRoutes(rootDir)
  await compileProgram(rootDir, outputDir, routes)

  return { routes }
}
