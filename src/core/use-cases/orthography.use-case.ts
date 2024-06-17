import type { OrthographyResponse } from "../../interfaces"; // va con un type para que no se importe en tiempo de ejecución



export const orthographyUseCase = async( prompt: string ) => {

    try {
        
        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/orthography-check`, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' // Tipo de contenido que se enviará
            },
            body: JSON.stringify({ prompt }) // Datos a enviar
        });

        if ( !resp.ok ) throw new Error('No se pudo realizar la corrección del texto. Inténtalo de nuevo.');

        const data = await resp.json() as OrthographyResponse; // Se espera la respuesta y se convierte a JSON


        return {
            ok: true,
            ...data,
        }


    } catch (error) {
        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'No se pudo realizar la corrección del texto. Inténtalo de nuevo.'
        }
    }


}