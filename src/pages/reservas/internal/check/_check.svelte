<script lang="ts">
    import QrScanner from 'qr-scanner'; 
    import type { RequestPatchBodyT } from '../../api/internal/check';

    type ReservaT = {
      id: string;
      full_name: string;
      verified: boolean | null;
      emailHash: string;
    }
    
    let videoElement: HTMLVideoElement

    let selectedAction: 'BUY' | 'UNDO-BUY' | null = $state(null)
    let actionBtnText = $derived(selectedAction === "BUY" ? "Marcar como comprado" : selectedAction === "UNDO-BUY" ? "Desmarcar comprado" : "No hay acción")
    let resultReserva: string = $state("")

    let currentUser: {id?: string, email_hash?: string} = $state({})

    let getAllReservasPromise = $state(getAllReservas())
    
    async function getAllReservas() {
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

    async function callAction() {
      try {

        if (!selectedAction) throw new Error()
        
        const url = new URL(window.location.href);
        const query = new URLSearchParams(url.searchParams)
      
        const secret_key = query.get("secret_key")
        
        const { id, email_hash } = currentUser

        const bodyRequest = {
          email_hash,
          id,
          secret_key,
          action: selectedAction
        } as RequestPatchBodyT
        
        const res = await fetch("/reservas/api/internal/check", {
          method: "PATCH",
          body: JSON.stringify(bodyRequest)
        })
      
        if (!res.ok) {
          throw new Error()
        }

        if (selectedAction === "BUY") {
          selectedAction = "UNDO-BUY"
          resultReserva = "Comprada con exito"
        } else if (selectedAction === "UNDO-BUY") {
          selectedAction = "BUY"
          resultReserva = "Desmarcar comprada con exito"
        }
  
        setTimeout(async () => {
          await getReserva(JSON.stringify(currentUser))
          getAllReservasPromise = getAllReservas()
        }, 1500)
        
      } catch {
    
         if (selectedAction === "BUY") {
           resultReserva = "Hubo un error en el proceso de compra"
         } else if (selectedAction === "UNDO-BUY") {
           resultReserva = "Hubo un error en el proceso de desmarcar la compra"
         }
      }
    }

    async function getReserva(result: string, scanner?: QrScanner) {
      try {
        
        selectedAction = null
        
        const {id , email_hash} = JSON.parse(result)
        
        const res = await fetch(`/reservas/api/internal/check?id=${encodeURI(id)}&email_hash=${encodeURI(email_hash)}`, {
          method: "GET"
        })
        
        if (!res.ok) {
          resultReserva = "No existe la reserva"
          return
        }
        
        const resData = await res.json() as ReservaT

        currentUser.id = id
        currentUser.email_hash = email_hash
        
        if (!resData.verified) {
          resultReserva = `Reservada: ${resData.full_name} \n(${id})`
          selectedAction = "BUY"
        } else {
          resultReserva = `Comprada: ${resData.full_name} \n(${id})`
          selectedAction = "UNDO-BUY"
        }
        
      } catch {
        resultReserva = "Hubo un error en el proceso de verificación"
      } finally {
        scanner?.stop()
      }
    }
    
    async function scanQr() {
      
      const scanner = new QrScanner(
        videoElement,
        async result => {
          await getReserva(result.data, scanner)
        },
        {}
      )
      
      await scanner.start()
    }

    async function exportCSV() {

      const reservas = await getAllReservas()

      let csv = "ID,FULL_NAME,EMAIL_HASH,BUY\r\n"

      reservas.forEach(r => {
        csv += `${r.id},${r.full_name},${r.emailHash},${r.verified}\r\n`
      })

      const csvFile = new Blob([csv], {type: "text/csv"})

      const downloadLink = document.createElement("a")

      downloadLink.download = "Reservas-export.csv"
      downloadLink.href = window.URL.createObjectURL(csvFile)
      downloadLink.style.display = "none"
      
      document.body.appendChild(downloadLink)
      downloadLink.click()
    }
    
</script>

<div class="flex flex-col gap-4">

    <section>
        <h2 class="text-white text-xl">
            Consultar QR de reserva
        </h2>
        <span class="h-10 text-white" >
            {#if resultReserva}
                Resultado: {resultReserva}
            {/if}
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
    <hr/>
    <section class="text-white flex flex-col gap-3">
        <h2 class=" text-xl">
            Reservas
        </h2>
        {#await getAllReservasPromise}
            Cargando reservas
        {:then reservas} 
            <div class="p-2 bg-amber-200 text-black flex flex-row justify-start">
                <p>
                    Reservas: {reservas.length} | Compradas: {reservas.filter((r) => r.verified).length}
                </p>
                <button onclick={exportCSV} class="px-2 bg-gray-900 text-white mx-auto">
                    Exportar CSV
                </button>
            </div>
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
</div>