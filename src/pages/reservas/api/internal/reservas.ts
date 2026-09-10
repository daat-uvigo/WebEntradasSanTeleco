export const prerender = false;

import type { APIRoute } from "astro";
import { GetReservas } from "../../../../lib/db/db";
import { compareSecretStrings } from "../../../../lib/utils/compare";

export const GET = (async ({request}) => {

  const url = new URL(request.url);
  const query = new URLSearchParams(url.searchParams)

  const secret_key = query.get("secret_key")
  if (!secret_key) throw new Error()

  if (!compareSecretStrings(secret_key, import.meta.env.SECRET_KEY!)) throw new Error() 
  
  
  const reservas = await GetReservas()
  
  return new Response(
    JSON.stringify(reservas)
  )
}) satisfies APIRoute;