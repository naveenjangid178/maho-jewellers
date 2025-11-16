import { ShoppingBag, ShoppingCart } from 'lucide-react'
import Tilt from "react-parallax-tilt";
import { useNavigate } from 'react-router-dom';

const ShoppingCard = ({ id, name, index, image, grossWeight, netWeight, sku }) => {
    const navigate = useNavigate()

    return (
        <div
            // glareEnable={true}
            // glareMaxOpacity={0.3}
            // transitionSpeed={2500}
            // tiltMaxAngleX={10}
            // tiltMaxAngleY={10}
            key={index}
            className="text-center flex flex-col gap-2 md:min-w-60 min-w-full max-w-72 shadow-xs shadow-gray-500 bg-transparent backdrop-blur-2xl rounded">
            <span
                className='overflow-hidden max-h-62'
                onClick={() => navigate(`/product/${id}`)}
            >
                <img src={image} alt={name} className="w-full hover:scale-105 transition duration-300 h-62 object-center mb-2" />
            </span>
            <span className='pt-2 px-3'>
                <p className='text-start pt-2'>{name}</p>
                <p className='text-start pt-2'>Net Weight: {netWeight}</p>
                <p className='text-start pt-2'>Gross Weight: {grossWeight}</p>
            </span>
            <span className='flex justify-between items-center px-3 pb-4'>
                <p className='text-[#383434]'>{sku}</p>
                <ShoppingCart className='bg-[#9C1137] text-white rounded-full p-1 cursor-pointer' />
            </span>
        </div>
    )
}

export default ShoppingCard