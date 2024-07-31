import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Thanks = () => {
    const navigate = useNavigate()

    return (
        <div className=' text-white flex justify-center items-center h-full'>
            <div className='flex flex-col items-center gap-4'>
                <h2 className=' text-center text-2xl'>Terima Kasih telah melakukan pembayaran</h2>
                <button onClick={() => navigate("/")} className=' border w-72 rounded-md p-4 hover:bg-zinc-600'>Kembali ke halaman utama</button>
            </div>
        </div>
    )
}

export default Thanks