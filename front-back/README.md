## Installation From Empty

### Frontend (Client)

Follow the [Vite guide](https://vite.dev/guide/#scaffolding-your-first-vite-project)

```bash
npm create vite@latest
```

then you will see

```bash
Ok to proceed? (y) y
✔ Project name: … client
✔ Select a framework: › React
✔ Select a variant: › JavaScript
```

next,

```bash
cd client
npm install
npm run dev
```

next follow the [shadcn guide](https://ui.shadcn.com/docs/installation/vite), notice here we use the `tailwindcss@3` version.

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Add this import header in `src/index.css`:

```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Because we don't use **TypeScript** but use **Javascript**, we create file `jsconfig.json`

then add

```bash
{
    "compilerOptions":
    {
      "baseUrl": ".",
      "paths":
      {
        "@/*": ["./src/*"]
      }
    }
}
```

then

```bash
npm install -D @types/node
```

Add the following code to the `vite.config.ts` so your app can resolve paths without error:

```bash
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

```

Run the `shadcn-ui init` command to setup the project:

```bash
npx shadcn@latest init
```

```bash
✔ Which style would you like to use? › Default
✔ Which color would you like to use as the base color? › Slate
✔ Would you like to use CSS variables for theming? … no / yes
```

we can add the UI components now:

```bash
npx shadcn@latest add input button
```

```bash
npm install axios react-router-dom
```
