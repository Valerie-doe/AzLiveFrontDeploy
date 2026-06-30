const fs = require('fs');
const path = require('path');
const root = process.cwd();
const src = path.join(root, 'src');
const exts = ['.ts', '.tsx'];

const aliasMap = [
  { pattern: /(^|\/)sound$/, alias: '@/shared/services/sound' },
  { pattern: /(^|\/)types$/, alias: '@/types' },
  { pattern: /(^|\/)shared$/, alias: '@/shared' },
  { pattern: /(^|\/)layout$/, alias: '@/shared/layouts' },
  { pattern: /(^|\/)data$/, alias: '@/shared/constants/data' },
  { pattern: /(^|\/)live-hub(\/.*)?$/, alias: '@/features/live-hub$1' },
  { pattern: /(^|\/)products(\/.*)?$/, alias: '@/features/products$1' },
  { pattern: /(^|\/)clients(\/.*)?$/, alias: '@/features/clients$1' },
  { pattern: /(^|\/)dashboard(\/.*)?$/, alias: '@/features/dashboard$1' },
  { pattern: /(^|\/)search(\/.*)?$/, alias: '@/features/search$1' },
  { pattern: /(^|\/)collaborators(\/.*)?$/, alias: '@/features/collaborators$1' },
  { pattern: /(^|\/)integrations(\/.*)?$/, alias: '@/features/integrations$1' }
];

function isTsFile(file) {
  return exts.some((ext) => file.endsWith(ext));
}

function resolvePossibleFile(base) {
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx')
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function resolveImport(filePath, importPath) {
  return resolvePossibleFile(path.join(path.dirname(filePath), importPath));
}

function pathExists(fileDir, importPath) {
  return !!resolvePossibleFile(path.join(fileDir, importPath));
}

const featureMapping = {
  'live-hub': 'features/live-hub',
  products: 'features/products',
  clients: 'features/clients',
  collaborators: 'features/collaborators',
  dashboard: 'features/dashboard',
  search: 'features/search',
  integrations: 'features/integrations'
};

function normalizeImport(fileDir, importPath) {
  if (pathExists(fileDir, importPath)) {
    return importPath;
  }

  // Try adding more parent traversals until a valid file is found.
  let prefix = '';
  for (let i = 0; i < 5; i += 1) {
    const candidate = path.posix.join(prefix, importPath).replace(/\/g, '/');
    if (pathExists(fileDir, candidate)) {
      return candidate;
    }
    prefix = path.posix.join(prefix, '..');
  }

  // Map old top-level feature folders to new features paths.
  for (const [oldSegment, newSegment] of Object.entries(featureMapping)) {
    const regex = new RegExp(`(^|\.\./)(?:${oldSegment})(/.*)?$`);
    const match = importPath.match(regex);
    if (match) {
      const transformed = `${match[1]}${newSegment}${match[2] || ''}`;
      if (pathExists(fileDir, transformed)) {
        return transformed;
      }
      // try adding extra traversal levels for root-level imports
      let extraPrefix = '';
      for (let i = 0; i < 5; i += 1) {
        const candidate = path.posix.join(extraPrefix, transformed).replace(/\/g, '/');
        if (pathExists(fileDir, candidate)) {
          return candidate;
        }
        extraPrefix = path.posix.join(extraPrefix, '..');
      }
    }
  }

  // Handle layout imports
  if (importPath.endsWith('/layout') || importPath === 'layout') {
    const transformed = importPath.replace(/(^|\.\.\/|\.\/)*layout$/, 'shared/layouts');
    if (pathExists(fileDir, transformed)) {
      return transformed;
    }
  }

  return null;
}

function getAliasForImport(importPath) {
  for (const rule of aliasMap) {
    if (rule.pattern.test(importPath)) {
      return importPath.replace(rule.pattern, rule.alias);
    }
  }
  return null;
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (path.relative(src, p).startsWith('shared')) {
        scanDir(p);
      } else {
        scanDir(p);
      }
    } else if (entry.isFile() && isTsFile(p)) {
      rewriteImports(p);
    }
  }
}

function rewriteImports(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const updated = text.replace(/from\s+(['"])([^'"\n]+)\1/g, (match, quote, imp) => {
    if (imp.startsWith('@/') || imp.includes('/shared/') || imp.includes('/features/')) {
      return match;
    }

    const resolved = resolveImport(filePath, imp);
    if (resolved) {
      return match;
    }

    const alias = getAliasForImport(imp);
    if (alias) {
      changed = true;
      return `from ${quote}${alias}${quote}`;
    }

    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('Updated', path.relative(root, filePath));
  }
}

scanDir(src);
