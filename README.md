# ITC Atlas

This atlas on ITC and its global activities is a [Next.js](https://nextjs.org/) project.

## Getting Started 🚀

### 1. Dependencies

First, install the required dependencies using node:

```bash
npm i
```

### 2. Static data sources

Create the required static data sets with

```bash
npm run setup-data
```

This command also creates fake ITC data if the original data is not available. (temporary work-around).

### 3. The database

The website uses a `PostgreSQL` database via [prisma](https://prisma.io/).
The schema names follow the [prisma naming conventions](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#naming-conventions): mainly, *singular form* and *PascalCase* for models and *camelCase* for fields.

To run single queries (a module as .ts file) enter
```bash
npx dotenv -e .env.local -- npx ts-node --compiler-options {\"module\":\"commonjs\"} <pathToQueryFile>
```

To seed db manually
```bash
npx prisma db seed
```

To push the state of the *Prisma* schema file to the database without using migrations. Usually used during prototyping and local development.
```bash
npx dotenv -e .env.local -- npx prisma db push
```

To open up *Prisma Studio* to visually inspect and edit the data in the database run
```bash
 npx prisma studio
```

### 4. Starting the next.js app

Then run the development server (to check out the current state or start developing):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the atlas.

Visit https://nextjs.org/learn for informations on next.js.

## UI & Map Components 🗺

To start storybook for development run:

```bash
npm run storybook
```

Visit https://storybook.js.org/docs/react/get-started/introduction for more Information on how to use storybook.js with react.

## Building the website 📦

Note that building the next website will fail as long as there are unresolved TypeScript errors.
You can check for possible TypeScript errors with:

```bash
npm run type-check
```

If no TypeScript errors are thrown, the site can be built with:

```bash
npm run build
```

And eventually served in production mode with:

```{bash}
npm run start
```
