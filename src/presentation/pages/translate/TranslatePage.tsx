import { useState } from 'react'
import { GptMessage, MyMessage, TextMessageBoxSelect, TypingLoader } from '../../components';
import { translateTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  IsGpt: boolean; // true si es un mensaje de GPT, false si es un mensaje del usuario
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async ( text: string, selectedOptions: string ) => {

    setIsLoading(true); // Muestra el loader
    const newMessage = `Traduce: "${ text }" al idioma ${ selectedOptions }`;// Mensaje que se va a enviar a GPT
    setMessages((prev) => [...prev, { text: newMessage, IsGpt: false }]);// Agrega el mensaje del usuario a la lista de mensajes

    const { ok, message } = await translateTextUseCase( text, selectedOptions ); // Llama al caso de uso para traducir el texto
    setIsLoading(false); // Oculta el loader
    if ( !ok ) {
      return alert( message ); // Si no se pudo traducir, muestra un mensaje de error
    }

    setMessages((prev) => [...prev, { text: message, IsGpt: true }]);

  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Bienvenida */}
          <GptMessage text="Hola, ¿Qué quieres que traduzca hoy?" />

          
          {
            messages.map( (message, i) => (
              message.IsGpt
                ? <GptMessage key={i} text={ message.text } />
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

      <TextMessageBoxSelect
        onSendMessage={ handlePost }
        placeholder="Escribe tu mensaje aquí lo que deseas"
        options={ languages }
      />


    </div>
  )
}
