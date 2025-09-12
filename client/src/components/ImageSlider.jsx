import React, { useState, useEffect, useRef } from 'react';
import { images } from '../details';

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(1); // Start at first real slide
    const [isTransitioning, setIsTransitioning] = useState(true);
    const sliderRef = useRef(null);

    const totalSlides = images.length;

    // Add cloned first and last images
    const slides = [images[totalSlides - 1], ...images, images[0]];

    // Auto-slide
    useEffect(() => {
        const interval = setInterval(() => {
            slideNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const slideNext = () => {
        if (currentIndex >= totalSlides + 1) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    };

    const handleDotClick = (index) => {
        setIsTransitioning(true);
        setCurrentIndex(index + 1); // offset for cloned first slide
    };

    const handleTransitionEnd = () => {
        if (currentIndex === totalSlides + 1) {
            // Jump to real first slide
            setIsTransitioning(false);
            setCurrentIndex(1);
        }
        if (currentIndex === 0) {
            // Jump to real last slide
            setIsTransitioning(false);
            setCurrentIndex(totalSlides);
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
                        <img src={image} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
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
