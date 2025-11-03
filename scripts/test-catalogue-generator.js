import fs from "fs";
import path from "path";

// ----------------------
// CONFIGURATION
// ----------------------
const ROOT = path.resolve();
const TESTS_DIR = path.join(ROOT, "./playwright-e2e/tests/");
const OUT_DIR = path.join(ROOT, "test-catalogue");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

// ----------------------
// HELPER: Get all test files recursively
// ----------------------
const getTestFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectories (e.g., functional/, validation/, etc.)
      return getTestFiles(fullPath);
    }

    if (entry.isFile() && fullPath.match(/\.(spec|test)\.(js|ts)$/)) {
      // Only include files ending with .spec.js, .spec.ts, .test.js, or .test.ts
      return fullPath;
    }

    return [];
  });

// ----------------------
// HELPER: Parse tests + steps from a test file
// ----------------------
const parseTestFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");

  return content
    .split(/test\(/) // Split file on each "test("
    .slice(1) // Skip anything before the first test definition
    .map((block) => {
      // Extract test name (first string inside test(...))
      const testName = block.match(/['"`](.+?)['"`],/)?.[1] ?? "Unnamed test";

      // Extract any test.step("...") calls for steps within the test
      const steps = [...block.matchAll(/test\.step\(['"`](.+?)['"`]/g)].map((m) => m[1]);

      return { testName, steps };
    });
};

// ----------------------
// PROCESS TOP-LEVEL TEST GROUPS (e.g. pre-portal, pre-power-app)
// ----------------------
const topLevelGroups = fs
  .readdirSync(TESTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const group of topLevelGroups) {
  const groupPath = path.join(TESTS_DIR, group);
  const groupOutDir = path.join(OUT_DIR, group);

  if (!fs.existsSync(groupOutDir)) fs.mkdirSync(groupOutDir);

  // Identify test types inside this group
  const testTypes = fs
    .readdirSync(groupPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  // Process each test type
  for (const type of testTypes) {
    const files = getTestFiles(path.join(groupPath, type));

  // Build catalogue content for all files of this type
    const specFileContents = files
      .map((file) => {
        const relativeFile = path.relative(ROOT, file);
        const tests = parseTestFile(file);

        const formattedTestSteps = tests
          .map(
            (t) =>
              `## ${t.testName}\n${t.steps.map((s) => `- ${s}`).join("\n")}\n`
          )
          .join("\n");

      // Add a file header + the formatted tests
        return `${"-".repeat(100)}\n** File:** \`${relativeFile}\`\n\n${formattedTestSteps}`;
      })
      .join("\n\n");

    const outFile = path.join(groupOutDir, `test-catalogue-${type}.md`);
    fs.writeFileSync(outFile, `# ${type} catalogue\n\n${specFileContents}`);

    console.log(`Test catalogue written to ${outFile}`);
  }
}