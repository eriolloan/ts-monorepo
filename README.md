# How to build TypeScript mono-repo project

[![github actions](https://github.com/Quramy/npm-ts-workspaces-example/workflows/build/badge.svg)](https://github.com/Quramy/npm-ts-workspaces-example/actions)

This repository explains how to create monorepos project using npm and TypeScript.

## ToC

-   [ToC](#toc)
-   [Tools](#tools)
-   [Directory Structure](#directory-structure)
-   [Workspaces](#workspaces)
-   [Dependencies across packages](#dependencies-across-packages)
-   [Resolve dependencies as TypeScript projects](#resolve-dependencies-as-typescript-projects)
-   [Testing](#testing)
    -   [Updated](#updated)
-   [License](#license)

## Tools

-   npm cli(v7 or later)
-   TypeScript

## Directory Structure

Put each library under the `packages` directory.
Put each application under the `apps` directory.

Code you would import for reuse in other code would go to `packages/` while code you would run on a server (an API or a SPA for example) would go to `apps/`.

```
.
├── apps
│   ├── api
│   │   ├── dist
│   │   │   ├── main.d.ts
│   │   │   ├── main.js
│   │   │   └── main.js.map
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── main.test.ts
│   │   │   └── main.ts
│   │   └── tsconfig.json
├── node_modules/
├── README.md
├── package-lock.json
├── package.json
├── packages
│   ├── x-cli
│   │   ├── lib
│   │   │   ├── cli.d.ts
│   │   │   ├── cli.js
│   │   │   ├── cli.js.map
│   │   │   ├── main.d.ts
│   │   │   ├── main.js
│   │   │   └── main.js.map
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── cli.ts
│   │   │   ├── main.test.ts
│   │   │   └── main.ts
│   │   └── tsconfig.json
│   └── x-core
│       ├── lib
│       │   ├── index.d.ts
│       │   ├── index.js
│       │   └── index.js.map
│       ├── package.json
│       ├── src
│       │   └── index.test.ts
│       │   └── index.ts
│       └── tsconfig.json
├── tsconfig.build.json
└── tsconfig.json
```

## Workspaces

Using [npm workspaces feature](https://github.com/npm/rfcs/blob/latest/implemented/0026-workspaces.md), configure the following files:

Open `package.json` and append the `workspaces` key.

```js
/* package.json */

{
  "name": "npm-ts-workspaces-example",
  "private": true,
  ...
  "workspaces": ["packages/*"]
}
```

Exec `npm install`. After successful running, all dependencies included from each package are downloaded under the repository root `node_modules` directory.

## Dependencies across packages

In this example, the `x-cli` package depends on another package, `x-core`. So to execute (or test) `x-cli`, `x-core` packages should be installed.
But in development the `x-core` package is not published so you can't install it.

For example, `packages/x-cli/src/main.spec.ts` is a test code for `main.ts`, which depends on `packages/x-core/src/index.ts` .

```ts
/* packages/x-cli/src/main.ts.*/

import { awesomeFn } from '@quramy/x-core'

export async function main() {
    // dependencies across child packages
    const out = await awesomeFn()
    return out
}
```

So we need to link `x-core` package from `x-cli` to execute the `x-cli` 's test.

Workspaces feature of npm also solves this problem. `npm i` creates sim-links of each package into the top-level `node_modules` dir.

## Resolve dependencies as TypeScript projects

As mentioned above, npm cli resolves dependencies across packages. It's enough for "runtime". However considering TypeScript sources, in other words "static", it's not.

We need to tell "x-cli package depends on x-core" to TypeScript compiler. TypeScript provides much useful feature to do this, ["Project References"](https://www.typescriptlang.org/docs/handbook/project-references.html).

First, you add `composite: true` to project-root tsconfig.json to use project references feature.

```js
/* tsconfig.json */

{
  "compilerOptions": {
    ...
    "composite": true
  }
}
```

Second, configure each package's tsconfig and configure dependencies across packages.

```js
/* packages|apps/<project>/tsconfig.json */

{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib"
  },
  "references": [{ "path": "../x-core" }]
}
```

And create a project which depends on all packages:

```js
/* tsconfig.build.json */

{
  "files": [],
  "references": [{ "path": "packages/x-core" }, { "path": "packages/x-cli" }]
}
```

Let's exec `npx tsc --build tsconfig.build.json`. The .ts files included in all packages are build at once!

### Testing

Jest is used for testing TS code. It is configured globally in `/.jest.json`.

To add testing to a project, add a `test` script to its `package.json` :

```js
/* packages|apps/<project>/package.json */

    "scripts": {
        ...
        "test": "jest -c ../../.jest.json"
    }
```

## License

The MIT License (MIT)
