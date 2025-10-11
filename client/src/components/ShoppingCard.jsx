import { ShoppingBag } from 'lucide-react'
import React from 'react'

const ShoppingCard = ({name, index, image, price}) => {
    return (
        <div key={index} className="text-center flex flex-col gap-2 shadow-xs shadow-gray-500 bg-white p-4 rounded">
            <img src={image} alt={name} className="w-full h-52 object-center mb-2" />
            <p className='text-[#9C1137] text-start pt-2'>{price}</p>
            <span className='flex justify-between items-center'>
                <p className='text-[#383434]'>{name}</p>
                <ShoppingBag className='text-[#9C1137] cursor-pointer' />
            </span>
        </div>
    )
}

export default ShoppingCard