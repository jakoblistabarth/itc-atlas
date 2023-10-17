# ITC Atlas

This atlas about ITC (_Faculty of Geo-information Science and Earth Observation | University of Twente_) and its global activities is a [Next.js](https://nextjs.org/) project.

## Getting Started 🚀

### 1. Dependencies

First, install the required dependencies using node:

```bash
npm i
```

### 2. Static data sources

Load and create the required static data sets with:

```bash
npm run setup-data
```

### 3. The database

> **Note**
> The `DATABASE_URL` environment variable for local development needs to be provided in a `.env.local` file.

The website uses a `PostgreSQL` database via the ORM [prisma](https://prisma.io/).
The schema names follow the [prisma naming conventions](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#naming-conventions): mainly, _singular form_ and _PascalCase_ for models and _camelCase_ for fields.

To run single queries (a module as .ts file) run:

```bash
npx dotenv -e .env.local -- npx tsx <pathToQueryFile>
```

To seed the database run:

```bash
npx prisma db seed
```

To push the state of the _Prisma_ schema file to the database without using migrations (usually used during prototyping and local development) run:

```bash
npx dotenv -e .env.local -- npx prisma db push
```

To open up _Prisma Studio_ to inspect and edit the data via _Prisma_'s user interface run:

```bash
npx dotenv -e .env.local -- npx prisma studio
```

### 4. Starting the next.js app

Finally, run the development server (to check out the current state or start developing):

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## UI & Map Components 🗺

To start storybook (the component library) for development run:

```bash
npm run storybook
```

Visit [storybook.js.org/docs/](https://storybook.js.org/docs/react/get-started/introduction) for more Information on how to use storybook.js with react.

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

```bash
npm run start
```

## Testing 🧪

Run jest tests with:

```bash
npm run test
```
