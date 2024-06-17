import { useState } from 'react'
import { GptMessage, GptMessageSelectableImage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { imageGenerationUseCase, imageVariationUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  IsGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}

export const ImageTunningPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      IsGpt: true,
      text: 'Imagen base',
      info: {
        alt: 'Imagen base',
        imageUrl: 'http://localhost:3000/gpt/image-generation/1712109237379.png'
      }
    }
  ]);


  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  })

  const handleVariation = async() => {
    setIsLoading(true); // Muestra el loader
    const resp = await imageVariationUseCase( originalImageAndMask.original! );
    setIsLoading(false);

    if ( !resp ) return;

    setMessages( (prev) => [
      ...prev,
      {
        text: 'Variación',
        IsGpt: true,
        info: {
          imageUrl: resp.url,
          alt: resp.alt
        }
      }
    ])
  }


  const handlePost = async ( text: string ) => {
    setIsLoading(true); // Muestra el loader
    setMessages((prev) => [...prev, { text: text, IsGpt: false }]);// Agrega el mensaje del usuario a la lista de mensajes

    const { original, mask } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase( text, original, mask );
    setIsLoading(false); // Oculta el loader

    if ( !imageInfo ) {
      return setMessages((prev) => [...prev, { text: "Lo siento, no pude generar la imagen", IsGpt: true }]);
    }

    //? Mostrar respuesta en pantalla
    setMessages( prev => [
      ...prev,
      {
        text: text, // prompt
        IsGpt: true,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt
        }
      }
    ])

  }

  return (
    <>
      {
        originalImageAndMask.original && (
          <div className='fixed flex flex-col items-center top-10 right-10 z-10 fade-in'>
            <span>Editando</span>
            <img 
              className='border rounded-xl w-36 h-36 object-contain'
              src={ originalImageAndMask.mask ?? originalImageAndMask.original } 
              alt="Imagen original" 
            />
            <button onClick={ handleVariation } className='btn-primary mt-2' >Generar variación</button>
          </div>
        )
      }
      <div className="chat-container" >
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">

            {/* Bienvenida */}
            <GptMessage text="Hola,¿Qué imagen deseas crear?" />

            
            {
              messages.map( (message, i) => (
                message.IsGpt
                  ? <GptMessageSelectableImage
                      key={i} 
                      text={ message.text }
                      imageUrl={ message.info?.imageUrl! }
                      alt={ message.info?.alt! }
                      onImageSelected={ (maskImageUrl) => setOriginalImageAndMask({
                        original: message.info?.imageUrl!, // La imagen original
                        mask: maskImageUrl // La imagen seleccionada
                      }) }
                    />
                  : <MyMessage key={i} text={ message.text } />
              ))
            }


            {/* Loader */}
            {
              isLoading && ( // Si isLoading es true, muestra el loader sino no muestra nada
                <div className="col-start-1 col-end-12 fade-in" >
                  <TypingLoader />
                </div>
              )
            }
    
            
          </div>
        </div>

        <TextMessageBox
          onSendMessage={ handlePost }
          placeholder="Escribe tu mensaje aquí lo que deseas"
          disabledCorrections // Esta en true para desactivar las correcciones
        />


      </div>
    </>
  )
}

