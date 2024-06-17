

type GeneratedImage = Image | null; 

interface Image {
    url: string;
    alt: string;
}


export const imageGenerationUseCase = async (prompt: string, originalImage?: string, maskImage?: string): Promise<GeneratedImage> => {

    try {
        const response = await fetch(`${ import.meta.env.VITE_GPT_API }/image-generation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt, 
                originalImage, 
                maskImage 
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