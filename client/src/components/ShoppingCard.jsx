import { ShoppingBag } from 'lucide-react'
import Tilt from "react-parallax-tilt";

const ShoppingCard = ({ name, index, image, price }) => {
    return (
        <Tilt
            glareEnable={true}
            glareMaxOpacity={0.3}
            transitionSpeed={2500}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            key={index} 
            className="text-center flex flex-col gap-2 shadow-xs shadow-gray-500 bg-transparent backdrop-blur-2xl p-4 rounded">
            <img src={image} alt={name} className="w-full h-52 object-center mb-2" />
            <p className='text-[#9C1137] text-start pt-2'>{price}</p>
            <span className='flex justify-between items-center'>
                <p className='text-[#383434]'>{name}</p>
                <ShoppingBag className='text-[#9C1137] cursor-pointer' />
            </span>
        </Tilt>
    )
}

export default ShoppingCard