# Heena Arora Fashion

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
## Run locally

Create a `.env.local` file in the project root and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Then start the app with `npm install` and `npm run dev`.

The couture assistant sends messages to the local `/api/chat` endpoint, which calls Gemini on the server. The API key is never exposed to browser code. The default model is `gemini-flash-latest`; set `GEMINI_MODEL` in the server environment to use another Gemini model.

## Deploy on Vercel

Add `GEMINI_API_KEY` in the project's Vercel environment variables, then redeploy. `GEMINI_MODEL` is optional.
