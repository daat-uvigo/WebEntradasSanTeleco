// @ts-check
import 'dotenv/config';
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs"

import svelte from "@astrojs/svelte";

const hexLoader = {
    name: 'hex-loader',
    //@ts-ignore
    transform(code, id) {
        const [path, query] = id.split('?');
        if (query != 'raw-hex')
            return null;

        const data = fs.readFileSync(path);
        const hex = data.toString('hex');

        return `export default '${hex}';`;
    }
};

const adapter = async function() {
  if (process.env.PUBLIC_LOCAL === "true") {
    const nodejs = (await import("@astrojs/node")).default
    
    return nodejs({
      mode: "standalone"
    })
  }
  
  const vercel = (await import("@astrojs/vercel")).default
  
  return vercel()
}

// https://astro.build/config
export default defineConfig({
  security: {
    allowedDomains: [
      {hostname: 'santeleco.uvigo.es', protocol: 'https'}
    ]
  },

  vite: { plugins: [hexLoader ,tailwindcss()] },
  adapter: await adapter(),
  site: "https://santeleco.uvigo.es",

  // Native i18n Configuration
  i18n: {
    defaultLocale: "es",
    locales: ["es", "gl", "en"],
    routing: {
      prefixDefaultLocale: false,
    }
  },

  integrations: [svelte()]
});