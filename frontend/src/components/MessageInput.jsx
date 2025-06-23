import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Image, Send, X } from "lucide-react";

const MessageInput = () => {
  const [text, setText] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { sendMessages } = useChatStore()

  // const handleImagechange = (e) => {
  //   const file = e.target.files[0]
  //   if(!file.type.startsWith('image/')){
  //     toast.error("Please select an image file");
  //     return
  //   }
  //   data.append('image',imagePreview)
  //   // const reader = new FileReader()
  //   // reader.onloadend =()=>{
  //   //   setImagePreview(reader.result)
  //   // }
  //   // reader.readAsDataURL(file)
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file)) // for preivew
    }
  }
  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  };

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text && !imagePreview) return
    const formDataToSend = new FormData()
    formDataToSend.append('text', text)
    if (imageFile) {
      formDataToSend.append('image', imageFile)
    }

    try {
      // formDataToSend.forEach(element => {
      //   console.log(element);
      // });
      await sendMessages(formDataToSend)
      // await sendMessages({
      //   text: text.trim(),
      //   image: formDataToSend
      //   // image:imagePreview
      // })

      //clear the form
      setText("")
      setImagePreview(null)
      setImageFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.log("Failed to send message", error);
    }
  }
  return (
    <div className='p-4 w-full'>

      {imagePreview && (
        <div className='mb-3 flex items-center gap-2'>
          <div className='relative'>
            <img src={imagePreview} alt="Preview"
              className='size-20 object-cover rounded-lg border border-zinc-700' />
            <button
              onClick={removeImage}
              className='absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center'
            >
              <X className='size-3' />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type a message...'
            className='w-full input input-bordered rounded-lg input-sm sm:input-md'
          />
          <input
            type="file"
            className='hidden'
            accept='image/*'
            ref={fileInputRef}
            onChange={handleImageChange}

          />

          <button
            type='button'
            className={`hidden sm:flex btn btn-circle
            ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

        </div>
        <button
          type='submit'
          disabled={!text.trim() && !imagePreview}
          className='btn btn-sm btn-circle'
        ><Send size={22} /></button>

      </form>
    </div>
  )
}

export default MessageInput