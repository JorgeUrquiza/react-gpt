import { useState } from "react"
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  IsGpt: boolean; // true si es un mensaje de GPT, false si es un mensaje del usuario
  info?: { // Información adicional del mensaje
    userScore: number;
    errors: string[];
    message: string;
  }
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async ( text: string ) => {

    setIsLoading(true); // Muestra el loader
    setMessages((prev) => [...prev, { text: text, IsGpt: false }]);// Agrega el mensaje del usuario a la lista de mensajes

    //? Llamar al caso de uso de corrección de texto
    const { ok, errors, message, userScore } = await orthographyUseCase(text);
    if ( !ok ) { 
      setMessages((prev) => [...prev, { text: 'No se pudo realizar la correción', IsGpt: true }]); 
    } else {
      setMessages((prev) => [...prev, { 
        text: message, 
        IsGpt: true,
        info: { errors, message, userScore }
      }]);
    }
    console.log(errors)

    
    //Todo Añadir el mensaje de IsGpt en true
    
    setIsLoading(false); // Oculta el loader
  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Bienvenida */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo con las correciones :)" />

          
          {
            messages.map( (message, index) => (
              message.IsGpt
                ? (
                    <GptOrthographyMessage 
                      key={index}
                      { ...message.info! } // forma corta de pasar todas las propiedades de info
                    />
                  )
                : (
                    <MyMessage key={index} text={ message.text } />
                  )
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
