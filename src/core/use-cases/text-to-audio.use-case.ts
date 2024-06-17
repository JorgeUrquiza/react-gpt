

export const textToAudioUseCase = async( prompt: string, voice: string ) => {

    try {
        
        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/text-to-audio`, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' // Tipo de contenido que se enviará
            },
            body: JSON.stringify({ prompt, voice }) // Datos a enviar
        });

        if ( !resp.ok ) throw new Error('No se pudo realizar la generación del audio. Inténtalo de nuevo.');

        const audioFile = await resp.blob(); // Convertir la respuesta a un archivo de audio
        const audioUrl = URL.createObjectURL(audioFile); // Crear una URL para el archivo de audio

        console.log({ audioUrl })


        return {
            ok: true,
            message: prompt,
            audioUrl: audioUrl, // URL del archivo de audio
        }


    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo realizar la generación del audio. Inténtalo de nuevo.'
        }
    }


}