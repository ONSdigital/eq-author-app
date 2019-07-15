# 5. Investigate TypeScript / Flow

Date: 20/09/2017

## Status

Proposed

## Context

Strongly-typed code can provide a number of advantages in a medium-large codebase:

- Catch errors much earlier (at build-time). Runtime errors require manual testing or tools such as Selenium to track down—this is more expensive and prone to failure.
- Codebase is easier to understand as the code is much more explicit—potentially easier on-boarding of new developers.
- Available tooling such as [IntellisenseTM](https://code.visualstudio.com/docs/editor/intellisense) enhances developer experience.

However, there are a number of risks:

- Increased complexity of code—many developers are unfamiliar with stongly-typed languages.
- Increased complexity of tooling needed to compile the code. This is somewhat negated by the fact the existing build setup already transpiles code via Babel.

### Flow vs. TypeScript

There are two significant options in the strongly-typed Javascript market—[Flow](https://flow.org/) (Facebook) and [TypeScript](https://www.typescriptlang.org/) (Microsoft). Whilst Flow is a type-checker, TypeScript is a superset of the JavaScript language itself and both require additional tooling (in our case, via Webpack) to work.

For this exercise, we evaluated both options by setting up the relevant tools and refactoring some existing code to include types.

#### Flow

Although fairly easy to setup initially, integration with third-party libraries was problematic and poorly documented in some cases. [https://github.com/flowtype/flow-typed](flow-typed) was used (as recommended) and things worked briefly, errors due to incompatibilities between versions of software quickly became a problem.

#### TypeScript

Typescript was again, fairly easy to setup but, again, integrations with third-party libraries was the main cause of problems. The solution to this, installing type definitions via NPM seemed a better option than flow-typed. We were able to refactor some existing code successfully.

## Decision

TypeScript was slightly easier to set up and we were successful in refactoring existing code and so was the obvious choice. Going forward, it is recommended that we apply first to the [https://github.com/ONSdigital/eq-author-api](eQ Author API) codebase as it is smaller and simpler with less dependencies. This will be a valuable exercise, allowing us to understand the system better and make a decision regarding implementing TypeScript in the Author Application itself.

The [https://github.com/ONSdigital/eq-author/tree/spike-typescript](branch used for this spike) is still available on GitHub for reference.
