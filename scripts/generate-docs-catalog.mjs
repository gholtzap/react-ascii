import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = process.cwd();
const componentsDir = path.join(root, "src/components");
const outputPath = path.join(root, "demo/src/generatedDocsProps.ts");

function readSource(filePath) {
  return ts.createSourceFile(filePath, fs.readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function isExported(node) {
  return Boolean(node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
}

function typeText(node, sourceFile) {
  if (!node) return "unknown";
  return node.getText(sourceFile).replace(/\s+/g, " ");
}

function memberName(member) {
  if (!member.name) return "";
  if (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name) || ts.isNumericLiteral(member.name)) {
    return member.name.text;
  }
  return member.name.getText();
}

function defaultValuesFor(sourceFile, componentName) {
  const defaults = new Map();

  function readBindingPattern(pattern) {
    for (const element of pattern.elements) {
      if (!ts.isBindingElement(element) || !element.initializer) continue;
      const name = ts.isIdentifier(element.name) ? element.name.text : "";
      if (name) defaults.set(name, element.initializer.getText(sourceFile).replace(/\s+/g, " "));
    }
  }

  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === componentName) {
      const firstParam = node.parameters[0];
      if (firstParam && ts.isObjectBindingPattern(firstParam.name)) {
        readBindingPattern(firstParam.name);
      }
    }

    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name) || declaration.name.text !== componentName) continue;
        const initializer = declaration.initializer;
        if (!initializer || !ts.isArrowFunction(initializer)) continue;
        const firstParam = initializer.parameters[0];
        if (firstParam && ts.isObjectBindingPattern(firstParam.name)) {
          readBindingPattern(firstParam.name);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return defaults;
}

function propsForFile(fileName) {
  const componentName = path.basename(fileName, ".tsx");
  const filePath = path.join(componentsDir, fileName);
  const sourceFile = readSource(filePath);
  const defaults = defaultValuesFor(sourceFile, componentName);
  const rows = [];

  function visit(node) {
    if (ts.isInterfaceDeclaration(node) && isExported(node) && node.name.text === `${componentName}Props`) {
      for (const heritage of node.heritageClauses ?? []) {
        for (const inheritedType of heritage.types) {
          rows.push({
            name: "(inherits)",
            type: inheritedType.getText(sourceFile).replace(/\s+/g, " "),
            defaultValue: "-",
            description: `Inherited by ${node.name.text}.`,
          });
        }
      }

      for (const member of node.members) {
        if (!ts.isPropertySignature(member) && !ts.isMethodSignature(member)) continue;
        const name = memberName(member);
        if (!name) continue;
        rows.push({
          name,
          type: ts.isMethodSignature(member) ? member.getText(sourceFile).replace(/\s+/g, " ") : typeText(member.type, sourceFile),
          defaultValue: defaults.get(name) ?? "-",
          description: `Declared in ${node.name.text}.`,
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return [componentName, rows];
}

const entries = fs
  .readdirSync(componentsDir)
  .filter((fileName) => fileName.startsWith("Ascii") && fileName.endsWith(".tsx"))
  .sort()
  .map(propsForFile)
  .filter(([, rows]) => rows.length > 0);

const body = JSON.stringify(Object.fromEntries(entries), null, 2);
const source = `import type { DocsProp } from "./docsCatalog";

export const generatedDocsProps: Record<string, DocsProp[]> = ${body};
`;

fs.writeFileSync(outputPath, source);
console.log(`Generated ${entries.length} component prop tables at ${path.relative(root, outputPath)}`);
