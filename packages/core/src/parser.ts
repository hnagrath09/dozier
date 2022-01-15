import {
  createSourceFile,
  isExportAssignment,
  isFunctionDeclaration,
  isVariableStatement,
  ScriptTarget,
  SyntaxKind,
} from 'typescript'
import type { ArrowFunction, ExportAssignment, FunctionDeclaration, FunctionExpression, Identifier } from 'typescript'
import { lowerCase, upperFirst, words } from 'lodash'
import { getParamsMetaDataFromJsDoc, getFunctionParam } from './param'
import type { FunctionParams } from './param'
import { isExportDefaultModifier } from './statement'

function parseFunctionParams(functionDeclaration: ArrowFunction | FunctionDeclaration | FunctionExpression): {
  params: FunctionParams[]
} {
  const functionParams: FunctionParams[] = []
  functionDeclaration.parameters.forEach((param) => {
    const identifier = (param.name as Identifier).escapedText as string
    // @ts-ignore
    const meta = getParamsMetaDataFromJsDoc(param.jsDoc ?? [])
    const label = meta.dozierParam ?? upperFirst(words(identifier).map(lowerCase).join(' '))
    const paramData = getFunctionParam(param, meta)

    functionParams.push({ identifier, label, required: !param.questionToken, ...paramData })
  })

  return { params: functionParams }
}

export default function parse(fileContent: string) {
  const sourceFile = createSourceFile('./function.ts', fileContent, ScriptTarget.ESNext)
  const { statements } = sourceFile

  let functionDeclaration: FunctionDeclaration | ArrowFunction | FunctionExpression

  const exportDefaultStatement = statements.find(isExportAssignment)
  if (exportDefaultStatement) {
    const functionName = (exportDefaultStatement.expression as Identifier).escapedText as string | undefined
    /**
     * Handles the case
     *
     * function foo() {}
     *
     * export default foo
     */
    functionDeclaration = statements.find(
      (statement) => isFunctionDeclaration(statement) && statement.name?.escapedText === functionName,
    ) as FunctionDeclaration | undefined

    if (!functionDeclaration) {
      const variableStatements = statements.filter(isVariableStatement)
      for (const variableStatement of variableStatements) {
        const { declarations } = variableStatement.declarationList

        for (const declaration of declarations) {
          if ((declaration.name as Identifier)?.escapedText === functionName) {
            functionDeclaration = declaration.initializer as ArrowFunction | FunctionExpression
            break
          }
        }
      }
    }
  }
  /**
   * Handles the case
   *
   * export default function foo() {}
   */
  if (!functionDeclaration) {
    functionDeclaration = statements.find(
      (statement) => isFunctionDeclaration(statement) && isExportDefaultModifier(statement),
    ) as FunctionDeclaration | undefined
  }

  /**
   * Handles the case
   *
   * export default () => {}
   */
  if (!functionDeclaration) {
    const exportDefaultStatement = statements.find(
      (statement) => isExportAssignment(statement) && statement.expression.kind === SyntaxKind.ArrowFunction,
    )
    if (exportDefaultStatement) {
      functionDeclaration = (exportDefaultStatement as ExportAssignment).expression as ArrowFunction
    }
  }

  if (!functionDeclaration) {
    throw new Error('Could not find export default function')
  }

  return parseFunctionParams(functionDeclaration)
}
