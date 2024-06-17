import { useState } from 'react'
import { GptMessage, GptMessageAudio, MyMessage, TextMessageBoxSelect, TypingLoader } from '../../components';
import { textToAudioUseCase } from '../../../core/use-cases';


interface TextMessage {
  text: string;
  IsGpt: boolean; // true si es un mensaje de GPT, false si es un mensaje del usuario
  type: 'text'; // Tipo de mensaje
}

interface AudioMessage {
  text: string;
  IsGpt: boolean;
  audio: string;
  type: 'audio'; // Tipo de mensaje
}

type Message = TextMessage | AudioMessage;


const disclaimer = `## ¿Qué audio quieres generar hoy?
  * Todo el audio generado es por Ai, por lo que no es real, solo es una simulación de voz.
`

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]

export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);



  const handlePost = async (text: string, selectedVoice: string) => {

    setIsLoading(true); // Muestra el loader
    setMessages((prev) => [...prev, { text: text, IsGpt: false, type: 'text' }]);// Agrega el mensaje del usuario a la lista de mensajes

    //? useCase
    const { ok, message, audioUrl } = await textToAudioUseCase(text, selectedVoice);
    setIsLoading(false); // Oculta el loader

    if (!ok) return;

    setMessages((prev) => [
      ...prev,
      { text: `${selectedVoice} - ${message}`, IsGpt: true, type: 'audio', audio: audioUrl! } // Agrega el mensaje de GPT con el audio generado
    ]);
  }

  return (
    <div className="chat-container" >
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Bienvenida */}
          <GptMessage text={disclaimer} />


          {/* Muesta los mensajes del chat */}
          {
            messages.map((message, i) =>
              message.IsGpt ? (
                message.type === 'audio' // Si el mensaje es de tipo audio, muestra el componente GptMessageAudio, sino muestra el componente GptMessage
                  ? (
                    <GptMessageAudio
                      key={i}
                      text={message.text}
                      audio={message.audio}
                    />
                  ) : (
                    <GptMessage key={i} text={message.text} />
                  )
              ) : (
                <MyMessage key={i} text={message.text} />
              )
            )
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
        onSendMessage={handlePost}
        placeholder="Escribe tu mensaje aquí lo que deseas"
        options={voices}
      />


    </div>
  )
}
