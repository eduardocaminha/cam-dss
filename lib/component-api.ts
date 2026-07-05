import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

export type ComponentApiEntry = {
  prop: string
  values: string[]
}

/**
 * Extracts { prop, values } from every cva(...) variants block in a stock
 * components/ui/<slug>.tsx file, by walking its TS AST - not regex, since
 * class-name strings can contain characters that break naive brace
 * matching. Source of truth for the /components "API Reference" blocks.
 */
export function getComponentApi(slug: string): ComponentApiEntry[] {
  const filePath = path.join(process.cwd(), "components/ui", `${slug}.tsx`)
  if (!fs.existsSync(filePath)) return []

  const source = fs.readFileSync(filePath, "utf8")
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )

  const entries: ComponentApiEntry[] = []
  const seenProps = new Set<string>()

  function propertyKeyName(
    prop: ts.ObjectLiteralElementLike,
    sf: ts.SourceFile
  ): string | null {
    if (
      (ts.isPropertyAssignment(prop) || ts.isShorthandPropertyAssignment(prop)) &&
      (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))
    ) {
      return prop.name.getText(sf).replace(/^['"]|['"]$/g, "")
    }
    return null
  }

  function visit(node: ts.Node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "cva" &&
      node.arguments.length >= 2 &&
      ts.isObjectLiteralExpression(node.arguments[1])
    ) {
      const config = node.arguments[1]
      const variantsProp = config.properties.find(
        (p) => propertyKeyName(p, sourceFile) === "variants"
      )

      if (
        variantsProp &&
        (ts.isPropertyAssignment(variantsProp)) &&
        ts.isObjectLiteralExpression(variantsProp.initializer)
      ) {
        for (const groupProp of variantsProp.initializer.properties) {
          const propName = propertyKeyName(groupProp, sourceFile)
          if (
            propName &&
            !seenProps.has(propName) &&
            ts.isPropertyAssignment(groupProp) &&
            ts.isObjectLiteralExpression(groupProp.initializer)
          ) {
            const values = groupProp.initializer.properties
              .map((vp) => propertyKeyName(vp, sourceFile))
              .filter((v): v is string => !!v)

            if (values.length > 0) {
              seenProps.add(propName)
              entries.push({ prop: propName, values })
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return entries
}
