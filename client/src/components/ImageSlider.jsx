import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios'; 

const ImageSlider = () => { 
    const [currentIndex, setCurrentIndex] = useState(1); // Initial index set to 1 
    const [isTransitioning, setIsTransitioning] = useState(true); 
    const [sliderImages, setSliderImages] = useState([]); 
    const sliderRef = useRef(null); 

    // Variables for drag functionality
    const isDragging = useRef(false); 
    const dragStartX = useRef(0); 
    const dragEndX = useRef(0); 

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
        setCurrentIndex((prev) => prev + 1); 
    }; 

    const slidePrev = () => { 
        if (currentIndex <= 0) return; 
        setIsTransitioning(true); 
        setCurrentIndex((prev) => prev - 1); 
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

    // Mouse events for drag functionality
    const handleMouseDown = (e) => { 
        isDragging.current = true; 
        dragStartX.current = e.clientX; // Get mouse starting position
    };

    const handleMouseMove = (e) => { 
        if (!isDragging.current) return; 
        dragEndX.current = e.clientX; // Get current mouse position
        const dragDistance = dragStartX.current - dragEndX.current;
        if (dragDistance > 50) { 
            slideNext(); // Move to next slide when dragging right to left
            isDragging.current = false; // Stop dragging after moving
        } else if (dragDistance < -50) { 
            slidePrev(); // Move to previous slide when dragging left to right
            isDragging.current = false; // Stop dragging after moving
        }
    };

    const handleMouseUp = () => { 
        isDragging.current = false; // Stop dragging when mouse is released
    };

    // Touch events for drag functionality (Mobile support)
    const handleTouchStart = (e) => { 
        isDragging.current = true; 
        dragStartX.current = e.touches[0].clientX; // Get touch starting position
    };

    const handleTouchMove = (e) => { 
        if (!isDragging.current) return; 
        dragEndX.current = e.touches[0].clientX; // Get current touch position
        const dragDistance = dragStartX.current - dragEndX.current;
        if (dragDistance > 50) { 
            slideNext(); // Move to next slide when dragging right to left
            isDragging.current = false; // Stop dragging after moving
        } else if (dragDistance < -50) { 
            slidePrev(); // Move to previous slide when dragging left to right
            isDragging.current = false; // Stop dragging after moving
        }
    };

    const handleTouchEnd = () => { 
        isDragging.current = false; // Stop dragging when touch is released
    };

    return ( 
        <div 
            className="relative w-full overflow-hidden" 
            // Mouse events
            onMouseDown={handleMouseDown} // Mouse down event to start dragging
            onMouseMove={handleMouseMove} // Mouse move event to move slider while dragging
            onMouseUp={handleMouseUp} // Mouse up event to stop dragging

            // Touch events for mobile
            onTouchStart={handleTouchStart} // Touch start event to start dragging
            onTouchMove={handleTouchMove} // Touch move event to move slider while dragging
            onTouchEnd={handleTouchEnd} // Touch end event to stop dragging
        > 
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
                            className="w-screen object-center md:h-122" // Make image take full width and height 
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
                        className={`w-2 h-2 rotate-45 cursor-pointer ${currentIndex === index + 1 ? 'bg-[#9C1137]' : 'bg-[#D9D9D9]'}`}
                    ></div>
                ))}
            </div>
        </div>
    ); 
}; 

export default ImageSlider;