import fs from "fs/promises"
import path from "path"
import PocketBase from "pocketbase"

export const baseUrl = "https://santeleco.uvigo.es/api"
export const pb = new PocketBase(baseUrl)

async function* walk(dir) {
    for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

const photos_paths = walk("./fotos_santeleco/")

for await (const photo_path of photos_paths) { 
  const filename = path.basename(photo_path)
  const content = await fs.readFile(photo_path)
  const new_p = await pb.collection('photos').create({
    "img" : new File([content], filename)
  });
  console.log(new_p)
}
