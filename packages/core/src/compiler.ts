/**
 * Compiler recursively reads all the files and folders in the given directory
 * and returns a list of paths that can be used to generate the dozier documentation.
 *
 * @params: rootDirPath - The path to the directory that contains all the files and folders
 * @returns: A list of paths that can be used to generate the dozier documentation
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

import { resolve } from 'path'
import { readdir, readFile, lstat } from 'fs/promises'
import { upperFirst, words } from 'lodash'

type DozierFunction = {
  type: 'function'
  path: string
  title: string
}

type DozierModule = {
  type: 'module'
  path: string
  title: string
  children: DozierNode[]
}

type DozierNode = DozierFunction | DozierModule

async function isDir(dir: string): Promise<boolean> {
  const stat = await lstat(dir)
  return stat.isDirectory()
}

function getPath(itemName: string, dirName?: string): string {
  return dirName ? `${dirName}___${itemName}` : itemName
}

function getTitle(name: string): string {
  return upperFirst(words(name).join(' '))
}

async function getPaths(rootDirPath: string, rootDirName?: string): Promise<DozierNode[]> {
  const paths: DozierNode[] = []

  const dirContent = await readdir(rootDirPath)

  const files: string[] = []
  const folders: string[] = []

  // segregate files and folders
  for (const item of dirContent) {
    if (item.endsWith('.ts')) {
      const fileContent = await readFile(resolve(rootDirPath, item), 'utf8')
      if (!fileContent.trim().startsWith('/** @dozier-ignore */')) {
        files.push(item)
      }
    } else {
      const isItemDir = await isDir(resolve(rootDirPath, item))
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
    paths.push({
      type: 'function',
      title: getTitle(fileName),
      path: getPath(fileName, rootDirName),
    })
  }

  for (const folder of folders) {
    const folderName = rootDirName ? `${rootDirName}___${folder}` : folder
    const folderChildrenPaths = await getPaths(resolve(rootDirPath, folder), folderName)
    if (folderChildrenPaths.length > 0) {
      paths.push({
        type: 'module',
        title: getTitle(folder),
        path: getPath(folder, rootDirName),
        children: folderChildrenPaths,
      })
    }
  }

  return paths
}

export default async function compiler(rootDirPath: string) {
  return getPaths(rootDirPath)
}
