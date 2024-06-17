import { useState } from 'react'
import { GptMessage, MyMessage, TextMessageBoxFile, TypingLoader } from '../../components';
import { audioToTextUseCase } from '../../../core/use-cases';


interface Message {
  text: string;
  IsGpt: boolean; // true si es un mensaje de GPT, false si es un mensaje del usuario
}


export const AudioToTextPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async ( text: string, audioFile: File ) => {

    setIsLoading(true); // Muestra el loader
    setMessages((prev) => [...prev, { text: text, IsGpt: false }]);// Agrega el mensaje del usuario a la lista de mensajes

    // Todo useCase
    // console.log({text, audioFile});
    const resp = await audioToTextUseCase(audioFile, text);
    setIsLoading(false); // Oculta el loader

    if ( !resp ) return;
    // console.log({resp});

    const gptMessage = `
## Transcripción de audio:
__Duración:__ ${ Math.round( resp.duration ) } segundos
### El texto transcrito es:
${ resp.text }
`

    setMessages( (prev) => [
      ...prev, // Mantiene los mensajes anteriores
      { text: gptMessage, IsGpt: true }
    ]);

    //? Acá se puede agregar el código para mostrar los segmentos de texto
//     for( const segment of resp.segments ) {
//       const segmentMessage = `
// __De ${ Math.round( segment.start ) } a ${ Math.round( segment.end ) } segundos:__
// ${ segment.text }
// `

//       setMessages( (prev) => [
//         ...prev, // Mantiene los mensajes anteriores
//         { text: segmentMessage, IsGpt: true }
//       ]);

//     }

  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Bienvenida */}
          <GptMessage text="Hola, ¿Qué audio quieres que escuche?" />

          
          {
            messages.map( (message, i) => (
              message.IsGpt
                ? <GptMessage key={i} text={ message.text } />
                : <MyMessage key={i} text={ (message.text === '') ? 'Transcribe el audio' : message.text } />
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

      <TextMessageBoxFile
        onSendMessage={ handlePost }
        placeholder="Escribe tu mensaje aquí lo que deseas"
        disabledCorrections // Esta en true para desactivar las correcciones
        accept='audio/*'
      />


    </div>
  )
}
