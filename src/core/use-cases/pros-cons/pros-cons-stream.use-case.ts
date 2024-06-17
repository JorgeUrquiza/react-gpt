


export const prosConsStreamUseCase = async( prompt: string ) => {

    try {
        
        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/pros-cons-discusser-stream`, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' // Tipo de contenido que se enviará
            },
            body: JSON.stringify({ prompt }) // Datos a enviar
            // TODO abortSingal
        });

        if ( !resp.ok ) throw new Error('No se pudo realizar la comparacion. Inténtalo de nuevo.');

        //? Se obtiene el reader del body de la respuesta
        const reader = resp.body?.getReader(); // El reader es un objeto que permite leer el stream de la respuesta del servidor
        if ( !reader ) {
            console.log('No se pudo obtener el reader');
            return null;
        }

        return reader;

        // const decoder = new TextDecoder(); // Se crea un decodificador de texto
        // let text = ''; // Se inicializa el texto que se irá acumulando

        // while (true) {
        //     const { value, done } = await reader.read();
        //     if  ( done ) {
        //         break; // Si ya se terminó de leer el stream, se sale del ciclo para evitar un bucle infinito
        //     }

        //     const decodedChunk = decoder.decode(value, {stream: true} ); // Se decodifica el chunk de datos que se leyó
        //     text += decodedChunk; // Se acumula el texto decodificado en la variable text += es para concatenar
        //     console.log(text);
        // }
        

    } catch (error) {
        console.log(error);
        return null;
    }


}