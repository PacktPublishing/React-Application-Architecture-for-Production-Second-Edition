export default {
  input: `${process.env.VITE_API_URL}/doc`,
  output: {
    format: 'prettier',
    path: './src/types/generated',
  },
  plugins: [
    {
      name: '@hey-api/typescript',
      exportFromIndex: false,
    },
    'zod',
  ],
};
