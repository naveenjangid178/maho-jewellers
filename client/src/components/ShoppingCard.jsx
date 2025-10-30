import { ShoppingBag, ShoppingCart } from 'lucide-react'
import Tilt from "react-parallax-tilt";

const ShoppingCard = ({ name, index, image, grossWeight, netWeight }) => {
    return (
        <Tilt
            glareEnable={true}
            glareMaxOpacity={0.3}
            transitionSpeed={2500}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            key={index}
            className="text-center flex flex-col gap-2 md:min-w-52 max-w-60 min-w-[250px] shadow-xs shadow-gray-500 bg-transparent backdrop-blur-2xl rounded">
            <img src={image} alt={name} className="w-full h-52 object-center mb-2" />
            <span className='pt-2 px-3'>
                <p className='text-start pt-2'>Net Weight: {netWeight}</p>
                <p className='text-start pt-2'>Gross Weight: {grossWeight}</p>
            </span>
            <span className='flex justify-between items-center px-3 pb-4'>
                <p className='text-[#383434]'>{name}</p>
                <ShoppingCart className='bg-[#9C1137] text-white rounded-full p-1 cursor-pointer' />
            </span>
        </Tilt>
    )
}

export default ShoppingCard