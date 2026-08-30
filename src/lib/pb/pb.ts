import type { Partner } from "./Partners"
import type { Photo } from "./Photos"
import type { Post } from "./Posts";
import PocketBase, { RecordService } from 'pocketbase';

const localUrl = "http://localhost:8090/"
const productionUrl = "https://santeleco.uvigo.es/api"
export const baseUrl = location.hostname === "localhost" ? localUrl : productionUrl

interface TypedPocketBase extends PocketBase {
  collection(idOrName: string): RecordService // default fallback for any other collection
  collection(idOrName: 'partners'): RecordService<Partner>
  collection(idOrName: 'photos'): RecordService<Photo>
  collection(idOrName: 'posts'): RecordService<Post>
}

export const pb = new PocketBase(baseUrl) as TypedPocketBase