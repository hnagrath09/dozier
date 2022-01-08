import * as path from 'path'
import * as fs from 'fs/promises'
import { createSourceFile, FunctionDeclaration, isFunctionDeclaration, ScriptTarget, SyntaxKind } from 'typescript'
import type {
  Identifier,
  JSDocComment,
  JSDocTag,
  ModifiersArray,
  NodeArray,
  ParameterDeclaration,
  Statement,
} from 'typescript'
import capitalize from 'lodash/capitalize'
import kebabCase from 'lodash/kebabCase'

type StringParam = {
  type: 'string'
  meta: {}
}

type NumberParam = {
  type: 'number'
  meta: {
    minValue?: number
    maxValue?: number
    step?: number
  }
}

type DateParam = {
  type: 'date'
  meta: {
    minDate?: string
    maxDate?: string
  }
}

type FunctionParams = (StringParam | NumberParam | DateParam) & {
  identifierName: string
  name: string
}

function getParamsMetaDataFromJsDoc(jsDocs: JSDocComment[]) {
  const meta: Record<string, string> = {}
  for (const jsDoc of jsDocs) {
    // @ts-ignore
    const tags = (jsDoc.tags ?? []) as JSDocTag[]
    for (const tag of tags) {
      meta[tag.tagName.escapedText as string] = tag.comment as string
    }
  }
  return meta
}

function transformName(name: string): string {
  return capitalize(kebabCase(name).split('-').join(' '))
}

function isDateParam(param: ParameterDeclaration): boolean {
  // @ts-ignore
  return param.type?.kind === SyntaxKind.TypeReference && param.type?.typeName?.escapedText === 'Date'
}

function getFunctionParam(param: ParameterDeclaration): FunctionParams {
  const identifierName = (param.name as Identifier).escapedText as string
  // @ts-ignore
  const meta = getParamsMetaDataFromJsDoc(param.jsDoc ?? [])
  const name = transformName(meta.dozierParam ?? identifierName)
  const paramData = { name, identifierName }

  if (param.type?.kind === SyntaxKind.StringKeyword) {
    return {
      ...paramData,
      type: 'string',
      meta: {},
    }
  }

  if (param.type?.kind === SyntaxKind.NumberKeyword) {
    return {
      ...paramData,
      type: 'number',
      meta: {
        maxValue: meta.maxValue ? ~~meta.maxValue : undefined,
        minValue: meta.minValue ? ~~meta.minValue : undefined,
        step: meta.step ? ~~meta.step : undefined,
      },
    }
  }
  if (isDateParam(param)) {
    return {
      ...paramData,
      type: 'date',
      meta: {
        maxDate: meta.maxDate,
        minDate: meta.minDate,
      },
    }
  }
  throw new Error('Unsupported parameter type')
}

// Check if a node is an export default modifier
function isExportDefaultModifier(modifier?: ModifiersArray): boolean {
  if (!modifier) {
    return false
  }
  return (
    modifier.some((modifier) => modifier.kind === SyntaxKind.ExportKeyword) &&
    modifier.some((modifier) => modifier.kind === SyntaxKind.DefaultKeyword)
  )
}

function parseDefaultFunction(statements: NodeArray<Statement>): {
  functionName: string
  functionParams: FunctionParams[]
} {
  // Find export default function
  const functionDeclaration = statements.find((statement) => {
    return isFunctionDeclaration(statement) && isExportDefaultModifier(statement.modifiers)
  }) as FunctionDeclaration | undefined

  if (!functionDeclaration) {
    throw new Error('Could not find export default function')
  }

  const functionName = functionDeclaration.name?.escapedText as string
  const functionParams: FunctionParams[] = []
  functionDeclaration.parameters.forEach((param) => {
    functionParams.push(getFunctionParam(param))
  })

  return { functionName, functionParams }
}

/**
 * Parses a typescript file and returns the function arguments
 * step1: Read the file content using the provided path
 * step2: Create a source file from the content using `ts.createSourceFile`
 * step3: Extract all the useful info about export default function using `parseDefaultFunction`
 *
 * @param pathname - path to the file to parse
 */
async function parse(pathname: string) {
  const fileContent = await fs.readFile(pathname, 'utf8')

  const sourceFile = createSourceFile(pathname, fileContent, ScriptTarget.ESNext)
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(parseDefaultFunction(sourceFile.statements), null, 2))
}

parse(path.resolve(__dirname, '../functions/sum.ts'))
