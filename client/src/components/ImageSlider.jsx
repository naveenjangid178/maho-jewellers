import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [sliderImages, setSliderImages] = useState([]);
    const sliderRef = useRef(null);

    // Fetch images from API
    useEffect(() => {
        const getAllSidebarImages = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/slider/`);
                setSliderImages(response.data); // response.data is expected to be an array
            } catch (error) {
                console.error('Error fetching sidebar images:', error);
            }
        };
        getAllSidebarImages();
    }, []);

    const totalSlides = sliderImages.length;

    // Add cloned first and last images only if images are available
    const slides =
        totalSlides > 0
            ? [sliderImages[totalSlides - 1], ...sliderImages, sliderImages[0]]
            : [];

    // Auto-slide
    useEffect(() => {
        if (totalSlides === 0) return;
        const interval = setInterval(() => {
            slideNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, totalSlides]);

    const slideNext = () => {
        if (currentIndex >= totalSlides + 1) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    };

    const handleDotClick = (index) => {
        setIsTransitioning(true);
        setCurrentIndex(index + 1); // Offset due to cloned first slide
    };

    const handleTransitionEnd = () => {
        if (currentIndex === totalSlides + 1) {
            setIsTransitioning(false);
            setCurrentIndex(1); // Jump to first real slide
        } else if (currentIndex === 0) {
            setIsTransitioning(false);
            setCurrentIndex(totalSlides); // Jump to last real slide
        }
    };

    return (
        <div className="relative w-full h-90 overflow-hidden">
            {/* Slide Container */}
            <div
                ref={sliderRef}
                className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    width: `${slides.length * 100}%`,
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {slides.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        <img
                            src={image?.imageUrl}
                            alt={`Slide ${index}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {sliderImages.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-2 h-2 rotate-45 cursor-pointer ${
                            currentIndex === index + 1 ? 'bg-[#9C1137]' : 'bg-[#D9D9D9]'
                        }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;