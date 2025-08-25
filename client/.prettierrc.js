export default {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'es5',
  tabWidth: 2,
  jsxSingleQuote: true,

  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],

  tailwindStylesheet: './src/index.css',

  importOrder: [
    '^(node:)?(react|next|axios|socket.io-client|@reduxjs/toolkit)(.*)$', // Node.js builtins
    '^@/(components|features|hooks|contexts)(.*)$', // Aliases (e.g., "@/components/Button")
    '^@/(.*)$', // Aliases (e.g., "@/assets/logo.png")
    '^\\.\\.\\/(.*)$', // '../'
    '^\\.\\/(.*)$', // './'
    '<THIRD_PARTY_MODULES>',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
