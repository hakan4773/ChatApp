import Image from 'next/image'
import React from 'react'

const Page = () => {
  return (
    <div className='min-h-screen flex flex-col bg-blue-100'>
      {/* Header */}
      <div className='bg-blue-500 text-white p-4 flex items-center justify-between shadow-md'>
        <div className='flex items-center space-x-3'>
          <Image 
            src="/5.jpg" 
            width={40} 
            height={40} 
            alt="avatar" 
            className='rounded-full object-cover border-2 border-white'
          />
          <div>
            <h1 className='font-bold'>John Doe</h1>
            <p className='text-xs text-blue-100'>Online</p>
          </div>
        </div>
        <button className='p-2 rounded-full hover:bg-blue-600'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className='flex-1 p-4 overflow-y-auto space-y-4'>
        {/* Received message */}
        <div className='flex items-start space-x-2'>
          <Image 
            src="/5.jpg" 
            width={32} 
            height={32} 
            alt="avatar" 
            className='rounded-full object-cover'
          />
          <div className='bg-white p-3 rounded-lg rounded-tl-none max-w-xs shadow'>
            <p>Hey there! How are you doing?</p>
            <p className='text-xs text-gray-500 mt-1'>10:30 AM</p>
          </div>
        </div>

        {/* Sent message */}
        <div className='flex justify-end'>
          <div className='bg-blue-500 text-white p-3 rounded-lg rounded-tr-none max-w-xs shadow'>
            <p>I'm good, thanks for asking! How about you?</p>
            <p className='text-xs text-blue-100 mt-1'>10:32 AM</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className='p-4 border-t bg-white'>
        <div className='flex items-center space-x-2'>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <input 
            type="text" 
            placeholder='Type a message...' 
            className='flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button className='p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page