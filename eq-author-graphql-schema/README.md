# eq-author-graphql-schema

[![Greenkeeper badge](https://badges.greenkeeper.io/ONSdigital/eq-author-graphql-schema.svg)](https://greenkeeper.io/)

GraphQL type definitions and schema for [eq-author](https://github.com/ONSdigital/eq-author).

## Publishing

1. Create new branch
2. Make any changes
3. Commit changes
4. Run `npm version [minor|patch|major]`. This will:
    1. Update the package.json version
    2. Commit changes to package.json
    3. Create a git tag
    4. Push changes
5. Create PR
6. Merge PR
7. Pull master
8. Run `npm publish` (ensure you have the correct credentials)