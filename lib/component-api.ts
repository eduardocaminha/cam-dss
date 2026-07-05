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

  // Many components (Avatar, Card, Select, Switch, Sheet, Carousel, ...)
  // don't use cva at all - their own extra props (size, side, orientation,
  // align) are typed as a plain string-literal union in the function's
  // parameter type, e.g. `{...}: Primitive.Props & { size?: "sm" | "lg" }`.
  // Only the shadcn-authored intersection member is a TypeLiteral we can
  // walk here; the imported primitive's own props are an opaque type
  // reference, so this naturally never pulls in noise from Base UI itself.
  function collectInlineUnionProps(typeNode: ts.TypeNode) {
    const literals: ts.TypeLiteralNode[] = ts.isTypeLiteralNode(typeNode)
      ? [typeNode]
      : ts.isIntersectionTypeNode(typeNode)
        ? typeNode.types.filter((t): t is ts.TypeLiteralNode =>
            ts.isTypeLiteralNode(t)
          )
        : []

    for (const literal of literals) {
      for (const member of literal.members) {
        if (
          !ts.isPropertySignature(member) ||
          !member.type ||
          !ts.isIdentifier(member.name) ||
          seenProps.has(member.name.text)
        ) {
          continue
        }

        if (!ts.isUnionTypeNode(member.type)) continue

        const values = member.type.types
          .map((t) =>
            ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal)
              ? t.literal.text
              : null
          )
          .filter((v): v is string => !!v)

        if (values.length === member.type.types.length && values.length > 0) {
          seenProps.add(member.name.text)
          entries.push({ prop: member.name.text, values })
        }
      }
    }
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

    if (
      ts.isFunctionDeclaration(node) &&
      node.parameters.length > 0 &&
      node.parameters[0].type
    ) {
      collectInlineUnionProps(node.parameters[0].type)
    }

    // Some components (Carousel, NativeSelect) name their props type
    // instead of inlining it in the function signature - e.g.
    // `type CarouselProps = { orientation?: "horizontal" | "vertical" }`
    // referenced elsewhere by name. Walk type alias declarations too.
    if (ts.isTypeAliasDeclaration(node)) {
      collectInlineUnionProps(node.type)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return entries
}
