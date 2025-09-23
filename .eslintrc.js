module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "prettier"],
  rules: {
    curly: "warn",
    "newline-before-return": "warn",
    "no-restricted-exports": [
      "warn",
      {
        restrictDefaultExports: {
          direct: false,
          named: true,
          defaultFrom: true,
          namedFrom: true,
          namespaceFrom: true,
        },
      },
    ],
    "react/jsx-sort-props": [],
    "react/no-array-index-key": "warn",
    "react/no-danger": "warn",
    "react/self-closing-comp": "warn",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "function-declaration",
        unnamedComponents: "arrow-function",
      },
    ],
    "jsx-a11y/alt-text": "warb",
    "import/no-extraneous-dependencies": [
      "warn",
      {
        packageDir: __dirname,
      },
    ],
  },
};
