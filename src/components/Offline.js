/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Offline() {
    const redirect = useNavigate();

    useEffect(() => { if (navigator.onLine) redirect('/') }, [navigator.onLine])

    document.title = 'You are Offline'

    return <div className="w-100 h-100 d-flex justify-content-center align-items-center top-0 start-0 position-fixed">
        <div className='text-center px-4'>
            <h2 className='mb-2'>Offline...</h2>
            <p>The current page isn't available offline. Please try again when you're back online.</p>
        </div>
    </div>
}
