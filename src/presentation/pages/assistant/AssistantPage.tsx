import { useEffect, useState } from 'react'
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { createThreadUseCase, postQuestionUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  IsGpt: boolean; // true si es un mensaje de GPT, false si es un mensaje del usuario
}

export const AssistantPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  //? Generamos el threadID
  const [threadID, setThreadID] = useState<string>()

  //? Obtener el thread, y si no existe, crearlo
  useEffect(() => {
    const threadId = localStorage.getItem('threadID'); // Verifica si existe el threadID en el localStorage
    if ( threadID ) {
      setThreadID( threadId! ); // Si existe, lo asigna al estado //! se agrego ! para que no de error
    } else {
      createThreadUseCase()
        .then( (id) => {
          setThreadID(id); // Si no existe, crea un nuevo thread y lo asigna al estado
          localStorage.setItem('threadID', id); // Guarda el threadID en el localStorage
        } )
    }
  }, [])

  // useEffect(() => {
  //   if (threadID) {
  //     setMessages( (prev) => [...prev, { text: `Número de thread ${ threadID }`, IsGpt: true }] )
  //   }
  // }, [threadID])
  
  


  const handlePost = async ( text: string ) => {

    if ( !threadID ) return; // Si no existe el threadID, no hace nada

    setIsLoading(true); // Muestra el loader
    setMessages((prev) => [...prev, { text: text, IsGpt: false }]);// Agrega el mensaje del usuario a la lista de mensajes
    


    // Todo useCase
    const replies = await postQuestionUseCase( threadID, text ) // Envia la pregunta al servidor
    setMessages([]); // Limpia los mensajes

    setIsLoading(false); // Oculta el loader

    for (const reply of replies) {
      
      for (const message of reply.content) {
        setMessages( (prev) => [
          ...prev,
          { text: message, IsGpt: (reply.role === 'assistant'), info: reply } // Si el rol es assistant, el mensaje es de GPT
        ] )
      }      
    }    
  }


  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Bienvenida */}
          <GptMessage text="Hola, ¿En qué puedo ayudarte hoy?" />

          
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
