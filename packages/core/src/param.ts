import { SyntaxKind } from 'typescript'
import type { Identifier, JSDocComment, JSDocTag, ParameterDeclaration } from 'typescript'

export type StringParam = {
  type: 'string'
  meta: {}
}

export type NumberParam = {
  type: 'number'
  meta: {
    minValue?: number
    maxValue?: number
    step?: number
  }
}

export type DateParam = {
  type: 'date'
  meta: {
    minDate?: string
    maxDate?: string
  }
}

export type Param = StringParam | NumberParam | DateParam

export type FunctionParams = Param & {
  identifier: string
  label: string
  required: boolean
}

export type ParamMeta = Record<string, string>

export function getParamsMetaDataFromJsDoc(jsDocs: JSDocComment[]) {
  const meta: ParamMeta = {}
  for (const jsDoc of jsDocs) {
    // @ts-ignore
    const tags = (jsDoc.tags ?? []) as JSDocTag[]
    for (const tag of tags) {
      meta[tag.tagName.escapedText as string] = tag.comment as string
    }
  }
  return meta
}

export function isDateParam(param: ParameterDeclaration): boolean {
  // @ts-ignore
  return param.type?.kind === SyntaxKind.TypeReference && param.type?.typeName?.escapedText === 'Date'
}

export function getFunctionParam(param: ParameterDeclaration, meta: ParamMeta): Param {
  if (param.type?.kind === SyntaxKind.StringKeyword) {
    return {
      type: 'string',
      meta: {},
    }
  }

  if (param.type?.kind === SyntaxKind.NumberKeyword) {
    return {
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
      type: 'date',
      meta: {
        maxDate: meta.maxDate,
        minDate: meta.minDate,
      },
    }
  }
  throw new Error(`Unsupported parameter type ${param.type} received in ${(param.name as Identifier).escapedText}`)
}
