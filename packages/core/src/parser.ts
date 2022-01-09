import { createSourceFile, FunctionDeclaration, isFunctionDeclaration, ScriptTarget } from 'typescript'
import type { Identifier, NodeArray, Statement } from 'typescript'
import { lowerCase, upperFirst, words } from 'lodash'
import { getParamsMetaDataFromJsDoc, getFunctionParam } from './param'
import type { FunctionParams } from './param'
import { isExportDefaultModifier } from './statement'

function parseDefaultFunction(statements: NodeArray<Statement>): {
  functionName: string
  params: FunctionParams[]
} {
  // Find export default function
  const functionDeclaration = statements.find((statement) => {
    return isFunctionDeclaration(statement) && isExportDefaultModifier(statement)
  }) as FunctionDeclaration | undefined

  if (!functionDeclaration) {
    throw new Error('Could not find export default function')
  }

  const functionName = functionDeclaration.name?.escapedText as string
  const functionParams: FunctionParams[] = []
  functionDeclaration.parameters.forEach((param) => {
    const identifier = (param.name as Identifier).escapedText as string
    // @ts-ignore
    const meta = getParamsMetaDataFromJsDoc(param.jsDoc ?? [])
    const label = meta.dozierParam ?? upperFirst(words(identifier).map(lowerCase).join(' '))
    const paramData = getFunctionParam(param, meta)

    functionParams.push({ identifier, label, required: !param.questionToken, ...paramData })
  })

  return { functionName, params: functionParams }
}

/**
 * Parses a typescript file and returns the function arguments
 * step1: Read the file content using the provided path
 * step2: Create a source file from the content using `ts.createSourceFile`
 * step3: Extract all the useful info about export default function using `parseDefaultFunction`
 *
 * @param pathname - path to the file to parse
 */
export default function parse(fileContent: string) {
  const sourceFile = createSourceFile('./function.ts', fileContent, ScriptTarget.ESNext)
  return parseDefaultFunction(sourceFile.statements)
}
