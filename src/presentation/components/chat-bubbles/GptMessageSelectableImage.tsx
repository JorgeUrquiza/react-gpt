import { useEffect, useRef, useState } from "react";


interface Props {
    text: string;
    imageUrl: string;
    alt: string;
    onImageSelected?: (imageUrl: string) => void;
}

export const GptMessageSelectableImage = ({ imageUrl, onImageSelected }: Props) => {

    const originalImageRef = useRef<HTMLImageElement>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 }); // Coordenadas del mouse para saber donde se inicia el dibujo

    //? Aqui se carga la imagen en el canvas al renderizar el componente
    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');

        const image = new Image(); // aqui se crea la imagen
        image.crossOrigin = "Anonymous"; // Para evitar problemas de CORS
        image.src = imageUrl; // Aqui se le asigna la url de la imagen

        originalImageRef.current = image;

        image.onload = () => {
            ctx?.drawImage(image, 0, 0, canvas.width, canvas.height); // Dibujamos la imagen en el canvas
        }

    }, [])


    //? Cuando el usuario hace click en el canvas
    const onMouseDown = (
        event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        setIsDrawing(true);

        // Obtener las coordenadas del mouse relativo al canvas 
        const startX =
            event.clientX - canvasRef.current!.getBoundingClientRect().left;
        const startY =
            event.clientY - canvasRef.current!.getBoundingClientRect().top;

        // console.log({startX, startY});
        setCoords({ x: startX, y: startY });
    };

    //? Cuando el usuario suelta el click del mouse
    const onMouseUp = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current!;
        const url = canvas.toDataURL("image/png");
        console.log( url );
        // https://jaredwinick.github.io/base64-image-viewer/
        onImageSelected && onImageSelected(url);

    };

    //? Cuando el usuario mueve el mouse
    const onMouseMove = (
        event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        if (!isDrawing) return;

        const currentX =
            event.clientX - canvasRef.current!.getBoundingClientRect().left;
        const currentY =
            event.clientY - canvasRef.current!.getBoundingClientRect().top;

        // Calcular el alto y ancho del rectángulo
        const width = currentX - coords.x;
        const height = currentY - coords.y;

        const canvaWidth = canvasRef.current!.width;
        const canvaHeight = canvasRef.current!.height;

        // Limpiar el canva
        const ctx = canvasRef.current!.getContext("2d")!;

        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctx.drawImage(originalImageRef.current!, 0, 0, canvaWidth, canvaHeight);

        // Dibujar el rectangulo, pero en este caso, limpiaremos el espacio
        // ctx.fillRect(coords.x, coords.y, width, height); // Dibujamos el rectangulo
        ctx.clearRect(coords.x, coords.y, width, height);
    };

    
    const resetCanvas = () => {
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctx.drawImage(
            originalImageRef.current!,
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
        );

        onImageSelected && onImageSelected(imageUrl);
    };


    return (
        <div className="col-start-1 col-end-9 p-3 rounded-lg">
            <div className="flex flex-row items-start">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0">
                    G
                </div>
                <div className="relative ml-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">

                    <canvas
                        ref={canvasRef}
                        width={1024}
                        height={1024}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                    />

                    <button
                        onClick={resetCanvas}
                        className="btn-primary mt-2" 
                    >
                        Borrar Selección
                    </button>

                    {/* <span>{text}</span> */}
                    {/* <img 
                    src={ imageUrl }
                    alt={ alt }
                    className="rounded-xl w-96 h-96 object-cover"
                /> */}
                </div>
            </div>
        </div>
    )
}
