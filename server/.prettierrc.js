export default {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'es5',
  tabWidth: 2,

  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^@?\\w',
    // '^(node:|@)?(http|fs|socket.io|express|bcryptjs|dotenv|cloudinary|cookie-parser|jsonwebtoken|mongoose|multer)(.*)$', // Node.js builtins
    '^@/(.*)$', // Aliases (e.g., "@/components/Button")
    '^\\.\\.\\/(.*)$', // '../'
    '^\\.\\/(.*)$', // './'
    '<THIRD_PARTY_MODULES>',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
