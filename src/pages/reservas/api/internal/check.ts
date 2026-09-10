export const prerender = false;

import type { APIRoute } from "astro";
import { BuyReserva, GetReservaByIdAndEmailHash, UndoBuyReserva } from "../../../../lib/db/db";
import { compareSecretStrings } from "../../../../lib/utils/compare";

export type RequestPatchBodyT = {
  id?: string,
  email_hash?: string,
  secret_key?: string,
  action: "BUY" | "UNDO-BUY" | ""
}

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
    
    const { id, email_hash, secret_key, action } = await request.json() as RequestPatchBodyT

    if (!id || !email_hash || !secret_key || !action) throw new Error()
    
    if (!compareSecretStrings(secret_key, import.meta.env.SECRET_KEY!)) throw new Error() 

    if (action === "BUY") {
      const reserva = (await BuyReserva(id, email_hash))[0]
      return Response.json(reserva)
    } else if (action === "UNDO-BUY") {
      const reserva = (await UndoBuyReserva(id, email_hash))[0]
      return Response.json(reserva)
    } else throw new Error()
    
  } catch (e) {
    
    console.error(e)
    return new Response(JSON.stringify({error: e}), {
      status: 404,
      statusText: "Not found",
    })
  }
  
}) satisfies APIRoute;