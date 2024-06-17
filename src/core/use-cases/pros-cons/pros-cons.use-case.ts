import type { ProsConsResponse } from "../../../interfaces"; // va con un type para que no se importe en tiempo de ejecución



export const prosConsUseCase = async( prompt: string ) => {

    try {
        
        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/pros-cons-discusser`, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' // Tipo de contenido que se enviará
            },
            body: JSON.stringify({ prompt }) // Datos a enviar
        });

        if ( !resp.ok ) throw new Error('No se pudo realizar la comparacion. Inténtalo de nuevo.');

        const data = await resp.json() as ProsConsResponse; // Se espera la respuesta y se convierte a JSON


        return {
            ok: true,
            ...data,
        }


    } catch (error) {
        return {
            ok: false,
            content: 'No se puedo realizar la comparacion. Inténtalo de nuevo.'
        }
    }


}