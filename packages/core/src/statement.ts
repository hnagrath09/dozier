import { SyntaxKind } from 'typescript'
import type { Statement } from 'typescript'

// Check if a node is an export default modifier
export function isExportDefaultModifier(statement: Statement): boolean {
  const { modifiers } = statement

  if (!modifiers) {
    return false
  }

  return (
    modifiers.some((modifier) => modifier.kind === SyntaxKind.ExportKeyword) &&
    modifiers.some((modifier) => modifier.kind === SyntaxKind.DefaultKeyword)
  )
}
