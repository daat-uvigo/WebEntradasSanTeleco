<script lang="ts">
    import QrScanner from 'qr-scanner'; 

    type ReservaT = {
      id: string;
      full_name: string;
      verified: boolean | null;
      emailHash: string;
    }
    
    let videoElement: HTMLVideoElement

    let selectedAction: 'BUY' | 'UNDO-BUY' | null = $state(null)
    let actionBtnText = $derived(selectedAction === "BUY" ? "Marcar como comprado" : selectedAction === "UNDO-BUY" ? "Desmarcar comprado" : "No hay acción")
    let result: string = $state("")

    let currentUser: {id?: string, emailHash?: string, verified?: boolean} = $state({})
    
    async function getReservas() {
      try {
        const url = new URL(window.location.href);
        const query = new URLSearchParams(url.searchParams)
      
        const secret_key = query.get("secret_key")
    
        if (!secret_key) throw new Error()
        
        const res = await fetch(`/reservas/api/internal/reservas?secret_key=${secret_key}`)
      
        if (!res.ok) {
          throw new Error()
        }
    
        return await res.json() as ReservaT[]
      } catch {
        return []
      }
    }

    $effect(() => {
      getReservas()
    })

    async function callAction() {
      try {
        const url = new URL(window.location.href);
        const query = new URLSearchParams(url.searchParams)
      
        const secret_key = query.get("secret_key")
        
        const { id, emailHash } = currentUser
        
        if (!currentUser.verified) {
          const res = await fetch(`/reservas/api/internal/check?id=${encodeURI(id!)}&email_hash=${encodeURI(emailHash!)}&secret_key=${secret_key}&action=BUY`, {
            method: "PATCH"
          })
        
          if (!res.ok) {
            throw new Error()
          }
      
          currentUser.verified = true
          result = "Comprada con exito"
        } else {
          const res = await fetch(`/reservas/api/internal/check?id=${encodeURI(id!)}&email_hash=${encodeURI(emailHash!)}&secret_key=${secret_key}&action=UNDO-BUY`, {
            method: "PATCH"
          })
        
          if (!res.ok) {
            throw new Error()
          }
      
          currentUser.verified = false
          result = "Desmarcar comprada con exito"
        }
    
        setTimeout(async () => {
          await reloadReservas(JSON.stringify(currentUser))
        }, 1500)
        
      } catch {
    
         if (!currentUser.verified) {
           result = "Hubo un error en el proceso de compra"
         } else {
           result = "Hubo un error en el proceso de desmarcar la compra"
         }
      }
    }

    async function reloadReservas(result: string, scanner?: QrScanner) {
      try {
        
        selectedAction = null
        
        const {id , email_hash} = JSON.parse(result)
        
        const res = await fetch(`/reservas/api/internal/check?id=${encodeURI(id)}&email_hash=${encodeURI(email_hash)}`, {
          method: "GET"
        })
        
        if (!res.ok) {
          result = "No hay reserva"
          return
        }
        
        const resData = await res.json() as ReservaT
        
        if (!resData.verified) {
          result = `Reservada: ${resData.full_name} \n(${id})`
          selectedAction = "BUY"
          currentUser.id = id
          currentUser.emailHash = email_hash
          currentUser.verified = false
        } else {
          result = `Comprada: ${resData.full_name} \n(${id})`
          selectedAction = "UNDO-BUY"
          currentUser.verified = true
        }
        
      } catch {
        result = "Hubo un error en el proceso de verificación"
      } finally {
        scanner?.stop()
      }
    }
    
    async function scanQr() {
      
      const scanner = new QrScanner(
        videoElement,
        async result => {
          await reloadReservas(result.data, scanner)
        },
        {}
      )
      
      await scanner.start()
    }
    
</script>

<div class="flex flex-col gap-4">

    <section class="text-white flex flex-col gap-3">
        {#await getReservas()}
            Cargando reservas
        {:then reservas} 
            {#if reservas.length}
                {#each reservas as r}
                    <p class="p-2 bg-amber-100 text-gray-900">
                        Nombre: {r.full_name} (ID: {r.id}): Comprada - {r.verified ? 'SI' : 'NO'}
                    </p>
                {/each}
            {:else}
                Todavía no hay reservas
            {/if}
        {:catch}
            Fallo al obtener reservas
        {/await}
    </section>
    <hr/>
    <section>
        <h2 class="text-white text-xl">
            Resultado
        </h2>
        <span class="h-10 text-white" >
            {result}
        </span>
        
        <div class="flex flex-row">
            <button onclick={scanQr} class="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:hover:bg-indigo-700">
                Escanear
            </button>
            {#if selectedAction} 
                <button onclick={callAction} class="rounded-md bg-green-400 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:hover:bg-indigo-700">
                    {actionBtnText}
                </button>
            {/if}
        </div>
        
        <video bind:this={videoElement}></video>
    </section>
</div>