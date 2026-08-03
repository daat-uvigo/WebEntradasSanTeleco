import sharp from "sharp"
import fs from "fs/promises"
import path from "path"
import PocketBase from "pocketbase"

export const baseUrl = "https://santeleco.uvigo.es/api"
export const pb = new PocketBase(baseUrl)

/**
 * @param {string} dir 
 */
async function* walk(dir) {
    for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

const photos_paths = walk("./fotos_santeleco/")

for await (const photo_path of photos_paths) { 
  const ext = path.extname(photo_path)
  const filename_without_ext = path.basename(photo_path, ext)

  const content = await fs.readFile(photo_path)
  const webp_content = await sharp(content).webp().toBuffer()
      
  const new_p = await pb.collection('photos').create({
    "img" : new File([webp_content], `${filename_without_ext}.webp`)
  });

  console.log(new_p)
}
