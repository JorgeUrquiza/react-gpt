


type GeneratedImage = Image | null; 

interface Image {
    url: string;
    alt: string;
}


export const imageVariationUseCase = async ( originalImage: string ): Promise<GeneratedImage> => {

    try {
        const response = await fetch(`${ import.meta.env.VITE_GPT_API }/image-variation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                baseImage: originalImage,
            })
        });

        const { url, revised_prompt: alt } = await response.json(); // renombramos la propiedad revised_prompt a alt
        // console.log({ url, alt })

        return { url, alt };
        
        
    } catch (error) {
        console.error(error);
        return null;
    }

}