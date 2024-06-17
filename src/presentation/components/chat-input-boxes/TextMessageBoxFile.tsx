import { FormEvent, useRef, useState } from "react";



interface Props {
    onSendMessage: (message: string, file: File) => void;
    placeholder?: string;
    disabledCorrections?: boolean;
    accept?: string;
}

export const TextMessageBoxFile = ({ onSendMessage, placeholder, disabledCorrections = false, accept }: Props) => {

    const [message, setMessage] = useState('');

    const [selectedFile, setSelectedFile] = useState<File | null>();
    const inputFileRef = useRef<HTMLInputElement>(null);


    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // el trim es para quitar los espacios en blanco
        // if (message.trim().length === 0) return;// si el mensaje esta vacio no hace nada
        if ( !selectedFile ) return;

        onSendMessage( message, selectedFile );
        setMessage('');// limpiar el mensaje
        setSelectedFile(null);// limpiar el archivo seleccionado
    }



  return (
    <form 
        onSubmit={handleSendMessage}
        className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
    >

        <div className="mr-3">
            <button 
                type="button"
                className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                onClick={ () => inputFileRef.current?.click() } // al hacer click en el boton, se hace click en el input file que esta oculto
            >
                <i className="fa-solid fa-paperclip text-xl"></i>
            </button>

            <input 
                type="file"
                ref={inputFileRef} // referencia al input
                accept={accept}
                onChange={ (e) => setSelectedFile(e.target.files?.item(0) ) } // al seleccionar un archivo, se guarda en el estado
                hidden // oculta el input
            />

        </div>

        <div className="flex-grow ">
            <div className="relative w-full">

                <input 
                    type="text" 
                    autoFocus
                    name="message"
                    className="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    placeholder={placeholder}
                    autoComplete={ disabledCorrections ? 'on' : 'off' }
                    autoCorrect={ disabledCorrections ? 'on' : 'off' }
                    spellCheck={ disabledCorrections ? 'true' : 'false' }
                    value={message}
                    onChange={ (e) => setMessage(e.target.value) }
                />

            </div>
        </div>

        <div className="ml-4">
            <button 
                className="btn-primary"
                disabled={ !selectedFile }
            >
                {
                    (!selectedFile)
                        ? <span className="mr-2" >Enviar</span>
                        : <span className="mr-2" > { selectedFile.name.substring(0,10) + '...' } </span> // si hay un archivo seleccionado, muestra el nombre del archivo, el substring es para que no se muestre todo el nombre
                }
                
                <i className="fa-regular fa-paper-plane"></i>
            </button>
        </div>


    </form>
  )
}
