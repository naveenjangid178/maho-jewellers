import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const images = [
    "sli3.jpg",
    "sli2.jpg",
    "sli5.jpg",
];
const images2 = [
    "sli4.jpg",
    "sli2.jpg",
    "sli6.jpg",
];
const images3 = [
    "sli7.jpg",
    "sli1.jpg",
    "sli8.jpg",
];

const InfiniteColumn = ({ images, duration = 10, delay = 0, direction = "up" }) => {
    // Duplicate the images for seamless looping
    const allImages = [...images, ...images];
    const animationY = direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"];

    return (
        <div className="relative     md:h-[400px] h-[200px] overflow-hidden w-full">
            <motion.div
                className="flex flex-col"
                animate={{ y: animationY }} // Move up by half height (because duplicated)
                transition={{
                    repeat: Infinity,
                    duration: duration,
                    ease: "linear",
                    delay,
                }}
            >
                {allImages.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt={`scroll-img-${i}`}
                        className="w-44 h-auto object-cover mb-4 rounded-lg"
                    />
                ))}
            </motion.div>
        </div>
    );
};

const AnimatedImages = () => {
    const navigate = useNavigate()

    return (
        <div className="bg-[#f3ecde] lg:mx-24 mx-4 md:h-120 md:my-12 rounded my-4 flex flex-col md:flex-row justify-around gap-12 pt-12 md:px-20 px-4">
            <div className=" flex flex-col gap-4 md:justify-center md:max-w-1/2">
                <h3 className="md:text-4xl text-2xl font-medium">Masterfully crafted in India</h3>
                <p className="text-gray-800 text-xl">
                    Browse our complete collection featuring handcrafted Polki, Kundan, and heritage-inspired jewelry. Explore every design, from timeless classics to modern signature pieces—crafted to celebrate your unique style.
                </p>
                <button
                            className='text-white bg-[#262626] text-center hover:font-medium py-3 px-8 font-normal max-w-36 rounded cursor-pointer transform duration-100 ease-in-out'
                            onClick={() => navigate("/new-products")}
                        >Explore</button>
            </div>
            <div className="flex space-x-2">
                {/* Column 1 */}
                <div className="w-1/3">
                    <InfiniteColumn images={images3} duration={30} />
                </div>

                {/* Column 2 */}
                <div className="w-1/3">
                    <InfiniteColumn images={images2} duration={30} direction="down" />
                </div>

                {/* Column 3 */}
                <div className="w-1/3">
                    <InfiniteColumn images={images} duration={30} />
                </div>
            </div>
        </div>
    );
};

export default AnimatedImages;
