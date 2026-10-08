import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Architectural guard for the living public mockups, not visual or accessibility QA.
// Extend this inventory when adding a public renderer/page. Historical homepage
// sources, references, builder and feeds intentionally retain their own controls.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const markupFiles = [
  'dist/components.js',
  'dist/homepage/refresh-sections.js',
  'dist/homepage/interactions.js',
  'dist/contacts-page/components.js',
  'dist/catalog-page/components.js',
  'dist/catalog-page/interactions.js',
  'dist/object-page/components.js',
  'dist/object-page/dialogs.js',
  'scripts/build-homepage-gallery.mjs',
  'dist/homepage.html',
  'dist/homepage-components.html',
  'dist/contacts.html',
  'dist/property-catalog.html',
  'dist/property-object.html',
];
const localStyles = [
  'dist/homepage/refresh.css',
  'dist/homepage/services.css',
  'dist/homepage/gallery.css',
  'dist/contacts-page/styles.css',
  'dist/catalog-page/styles.css',
  'dist/object-page/styles.css',
  'dist/ui-components.css',
];
const files = new Map(await Promise.all([...new Set([...markupFiles, ...localStyles])]
  .map(async file => [file, await readFile(resolve(root, file), 'utf8')])));
const failures = [];
const report = (file, source, index, message) => {
  const line = source.slice(0, index).split('\n').length;
  failures.push(`${file}:${line}: ${message}`);
};
const attr = (tag, name) => tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))?.slice(1).find(value => value !== undefined) ?? '';
const classes = tag => new Set(attr(tag, 'class').split(/\s+/));
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const nonTextTypes = new Set(['checkbox', 'radio', 'hidden', 'button', 'submit', 'reset', 'file', 'image', 'range', 'color']);
const selectionGroups = new Map();

// Inspect literal HTML tags in these templates. No execution of page scripts is
// needed. RangeInput owns its joined controls; Select owns its internal controls.
// Native <select> itself is outside the Input contract.
for (const file of markupFiles) {
  const source = files.get(file);
  const parents = [];
  const groups = [];
  selectionGroups.set(file, groups);
  for (const match of source.matchAll(/<\/?([a-z][a-z\d-]*)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi)) {
    const [tag, rawName] = match;
    const name = rawName.toLowerCase();
    if (tag.startsWith('</')) {
      const index = parents.findLastIndex(parent => parent.name === name);
      if (index >= 0) parents.length = index;
      continue;
    }
    const ownClasses = classes(tag);
    const type = attr(tag, 'type').toLowerCase();
    if (ownClasses.has('ui-segments')) groups.push({ classes: ownClasses, parents: parents.map(parent => parent.classes) });
    if (name === 'input' && type === 'checkbox' && attr(tag, 'role') !== 'switch' && !ownClasses.has('ui-check')) {
      report(file, source, match.index, 'Checkbox must use ui-check (only role="switch" is exempt).');
    }
    const composite = parents.some(parent => parent.classes.has('ui-range-inputs') || parent.classes.has('kv-select'));
    if ((name === 'textarea' || (name === 'input' && !nonTextTypes.has(type))) && !composite && !ownClasses.has('ui-input')) {
      report(file, source, match.index, 'Standalone text/number field must use ui-input.');
    }
    if ((ownClasses.has('catalog-tabs') || ownClasses.has('gallery-categories') || ownClasses.has('ui-tabs')) && !ownClasses.has('ui-segments')) {
      report(file, source, match.index, 'Selection group must use ui-segments.');
    }
    if (parents.at(-1)?.classes.has('ui-segments') && ['a', 'button', 'label'].includes(name) && !ownClasses.has('ui-segment')) {
      report(file, source, match.index, 'Selection item must use ui-segment.');
    }
    if (!voidTags.has(name) && !tag.endsWith('/>')) parents.push({ name, classes: ownClasses });
  }
}

// Positive checks catch removal of the shared group from an entire consumer,
// including the radio recipient group which has no legacy class on its <div>.
const segmentConsumers = [
  ['dist/homepage/refresh-sections.js', 'catalog-tabs'],
  ['scripts/build-homepage-gallery.mjs', 'gallery-categories'],
  ['dist/contacts-page/components.js', 'c-recipient'],
  ['dist/components.js', 'ui-fieldset'],
  ['dist/components.js', 'ui-tabs'],
  ['dist/homepage.html', 'catalog-tabs'],
  ['dist/homepage-components.html', 'gallery-categories'],
  ['dist/contacts.html', 'c-recipient'],
];
for (const [file, consumer] of segmentConsumers) {
  const present = selectionGroups.get(file).some(group => group.classes.has(consumer) || group.parents.some(parent => parent.has(consumer)));
  if (!present) failures.push(`${file}: ${consumer} must use ui-segments; rebuild generated HTML after changing renderers.`);
}
for (const file of ['dist/homepage/refresh.css', 'dist/ui-components.css']) {
  const imports = [...files.get(file).matchAll(/@import\s+url\(\s*['"]([^'"]+)['"]\s*\)/g)]
    .map(match => resolve(root, dirname(file), match[1]));
  for (const shared of ['dist/ui-fields.css', 'dist/ui-selection.css']) {
    if (!imports.includes(resolve(root, shared))) failures.push(`${file}: must import ${shared}.`);
  }
}

// Deliberately bounded scan of the known legacy selectors and ordinary literal
// declaration blocks. This is not a CSS parser or a computed-style assertion.
// Layout (width, margin, flex/grid, gap, etc.) remains owned by the page.
const legacyControl = /(?:\.c-consent\b[^{}]*\binput\b|\.c-recipient\b[^{}]*\blabel\s*>\s*span\b|\.catalog-tabs\b[^{}]*\bbutton\b|\.gallery-categories\b[^{}]*\ba\b|\.ui-tabs\b[^{}]*\bbutton\b)/;
const skinProperty = /^(?:background(?:-.+)?|color|border(?:-.+)?|box-shadow|outline(?:-.+)?|font(?:-.+)?|line-height|letter-spacing|text-shadow|opacity|appearance|-webkit-appearance|accent-color|fill|stroke|content|mask(?:-.+)?|transition(?:-.+)?|animation(?:-.+)?)$/;
for (const file of localStyles) {
  const source = files.get(file).replace(/\/\*[^]*?\*\//g, comment => comment.replace(/[^\n]/g, ' '));
  for (const rule of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!legacyControl.test(rule[1])) continue;
    for (const declaration of rule[2].matchAll(/(?:^|;)\s*([\w-]+)\s*:/g)) {
      if (skinProperty.test(declaration[1].toLowerCase())) {
        report(file, source, rule.index, `Local selection skin "${declaration[1]}" must move to ui-selection.css: ${rule[1].trim()}`);
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`UI consistency verified: ${markupFiles.length} living sources/pages, shared field/selection imports and ${localStyles.length} local stylesheets. Visual and keyboard QA remain separate.`);
}
