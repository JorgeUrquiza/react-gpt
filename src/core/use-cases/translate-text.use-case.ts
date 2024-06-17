import { Translate } from "../../interfaces";



export const translateTextUseCase = async(  prompt: string, lang: string  ) => {

    try {

        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/translate`, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' // Tipo de contenido que se enviará
            },
            body: JSON.stringify({ prompt, lang }) // Datos a enviar
        });

        if ( !resp.ok ) throw new Error('No se pudo realizar la traducción. Inténtalo de nuevo.');

        const { message } = await resp.json() as Translate;
        // console.log(data)


        return {
            ok: true,
            message,
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo realizar la traducción. Inténtalo de nuevo.'
        }
    }
    

}