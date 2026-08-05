export const prerender = false;

import type { APIRoute } from "astro";
import { BuyReserva, GetReservaByIdAndEmailHash } from "../../../lib/db/db";
import { getSecret } from "astro:env/server";
import { compareSecretStrings } from "../../../lib/utils/compare";

export const GET = (async ({ request }) => {
  
  try {
    
    const url = new URL(request.url);
    const query = new URLSearchParams(url.searchParams)
    
    // console.log(url, query)
    
    const id = query.get("id")
    const emailHash = query.get("email_hash")
    
    if (!id || !emailHash) throw new Error()
    
    const reserva = (await GetReservaByIdAndEmailHash(id, emailHash))[0]
    
    return Response.json(reserva)
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({error: e}), {
      status: 404,
      statusText: "Not found",
    })
  }
  
}) satisfies APIRoute;

export const PATCH = (async ({ request }) => {
  
  try {
    
    const url = new URL(request.url);
    const query = new URLSearchParams(url.searchParams)
    
    const id = query.get("id")
    const emailHash = query.get("email_hash")
    const secret_key = query.get("secret_key")
    
    if (!id || !emailHash || !secret_key) throw new Error()

    if (!compareSecretStrings(secret_key, getSecret("SECRET_KEY")!)) throw new Error() 

    const reserva = (await BuyReserva(id, emailHash))[0]
    
    return Response.json(reserva)
  } catch (e) {
    
    console.error(e)
    return new Response(JSON.stringify({error: e}), {
      status: 404,
      statusText: "Not found",
    })
  }
  
}) satisfies APIRoute;