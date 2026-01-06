import tailwindPlugin from 'prettier-plugin-tailwindcss';

export default {
  endOfLine: 'auto',
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  plugins: [tailwindPlugin],
  tailwindFunctions: ['clsx', 'cn'],
};
