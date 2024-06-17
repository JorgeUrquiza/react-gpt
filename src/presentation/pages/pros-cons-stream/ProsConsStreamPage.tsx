import { useRef, useState } from 'react'
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { prosConsStreamGeneratorUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  IsGpt: boolean; // true si es un mensaje de GPT, false si es un mensaje del usuario
}

export const ProsConsStreamPage = () => {

  const abortController = useRef( new AbortController() ); // Se crea un abortController para cancelar la petición
  const isRunning = useRef(false); // Se crea un ref para saber si la petición está corriendo

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async ( text: string ) => {
    
    if ( isRunning.current ) {
      abortController.current.abort(); // Cancela la petición si ya está corriendo
      abortController.current = new AbortController(); // Se crea un nuevo abortController para poder ver la segunda petición
    } 


    setIsLoading(true); // Muestra el loader
    isRunning.current = true; // Para saber que la petición ya empezó
    setMessages((prev) => [...prev, { text: text, IsGpt: false }]);// Agrega el mensaje del usuario a la lista de mensajes

    //? useCase
    const stream = prosConsStreamGeneratorUseCase( text, abortController.current.signal ); // Mandamos el abortController para poder cancelar la petición
    setIsLoading(false); // Oculta el loader 

    setMessages( (messages) => [...messages, { text: '', IsGpt: true }] )

    //? Actualizar el último mensaje con el texto que se obtiene del stream
    for await (const text of stream) {
      setMessages( (messages) => {
            const newMessages = [ ...messages ];
            newMessages[ newMessages.length - 1 ].text = text; // Se actualiza el último mensaje, el -1 es para obtener el último elemento del array
            return newMessages;
          })
    }

    isRunning.current = false; // Para saber que la petición ya terminó

    
  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Bienvenida */}
          <GptMessage text="¿Qué deseas comparar hoy?" />

          
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

      <TextMessageBox
        onSendMessage={ handlePost }
        placeholder="Escribe tu mensaje aquí lo que deseas"
        disabledCorrections // Esta en true para desactivar las correcciones
      />


    </div>
  )
}
