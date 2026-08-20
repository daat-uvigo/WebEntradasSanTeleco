// @ts-check
import 'dotenv/config';
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs"

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
  if (process.env.LOCAL === "true") {
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
  }
});