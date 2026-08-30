import { pb } from "./pb";

export interface Post {
  id: string;
  img: string;
  url: string;
}

const postsColl = "posts"

export async function getPosts(): Promise<Post[]> {
  const list = await pb.collection(postsColl).getFullList()
  return list.map(i => {
    return {id: i.id, img: pb.files.getURL(i, i.img), url: i.url}
  })
}