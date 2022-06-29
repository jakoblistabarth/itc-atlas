# ITC Atlas

This atlas on ITC and its global activities is a [Next.js](https://nextjs.org/) project.

## Getting Started 🚀

First, install the required dependencies using node:

```bash
npm i
```

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
