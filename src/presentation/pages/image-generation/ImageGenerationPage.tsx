import { useState } from 'react'
import { GptMessage, GptMessageImage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { imageGenerationUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  IsGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}

export const ImageGenerationPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async ( text: string ) => {

    setIsLoading(true); // Muestra el loader
    setMessages((prev) => [...prev, { text: text, IsGpt: false }]);// Agrega el mensaje del usuario a la lista de mensajes

    const imageInfo = await imageGenerationUseCase( text );
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
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Bienvenida */}
          <GptMessage text="Hola,¿Qué imagen deseas crear?" />

          
          {
            messages.map( (message, i) => (
              message.IsGpt
                ? <GptMessageImage 
                    key={i} 
                    text={ message.text }
                    imageUrl={ message.info?.imageUrl! }
                    alt={ message.info?.alt! }
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
  )
}

