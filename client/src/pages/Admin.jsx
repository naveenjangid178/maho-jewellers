import React, { useState } from 'react'
import Catalogue from '../components/Admin/Catalogue'
import Header from '../components/Admin/Header'
import Users from "../components/Admin/Users"
import Products from "../components/Admin/Products"
import { X } from 'lucide-react'

const Admin = () => {
    const [createOption, setCreateOption] = useState("")
     const [selected, setSelected] = useState('Users');

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'>
            <Header selected={selected} setSelected={setSelected} createOption={createOption} setCreateOption={setCreateOption} />
            {selected === 'Users' && <Users />}
            {selected === 'Products' && <Products />}
            {selected === 'Catalogue' && <Catalogue />}

            {createOption === "product" && <div className='bg-transparent absolute top-0 left-0 h-full w-full flex items-center justify-center'>
                <div className='shadow-xs shadow-gray-500 backdrop-blur-sm p-4 relative min-h-72 min-w-72 rounded'>
                    <div>Create Product</div>
                    <span className='absolute top-2 right-2 hover:text-red-700 cursor-pointer' onClick={() => setCreateOption(!createOption)}><X /></span>
                </div>
            </div>}

            {createOption === "catalogue" && <div className='bg-transparent absolute top-0 left-0 h-full w-full flex items-center justify-center'>
                <div className='shadow-xs shadow-gray-500 backdrop-blur-sm p-4 relative min-h-72 min-w-72 rounded'>
                    <div>Create Catalogue</div>
                    <span className='absolute top-2 right-2 hover:text-red-700 cursor-pointer' onClick={() => setCreateOption(!createOption)}><X /></span>
                </div>
            </div>}
        </div>
    )
}

export default Admin