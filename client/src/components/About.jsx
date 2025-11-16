import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "f1.jpg",
    title: "JSS Jewellers",
    description:
      "JSS Jewelers is rooted in the royal legacy of Jaipur. Specializing in Polki and handcrafted Kundan jewelry, our pieces are created by master artisans using age-old techniques passed down through generations. Every design reflects timeless heritage, refined beauty, and the celebration of life’s most precious moments.",
  },
  {
    image: "f2.jpg",
    title: "JSS Jewellers",
    description:
      "JSS Jewelers is rooted in the royal legacy of Jaipur. Specializing in Polki and handcrafted Kundan jewelry, our pieces are created by master artisans using age-old techniques passed down through generations. Every design reflects timeless heritage, refined beauty, and the celebration of life’s most precious moments.",
  },
];

const SLIDE_DURATION = 8000; // ms
const TRANSITION_DURATION = 2; // s

const About = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-slide
  useEffect(() => {
    timeoutRef.current = setTimeout(() => nextSlide(), SLIDE_DURATION);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  // Motion variants
  const imageVariants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: TRANSITION_DURATION, ease: "easeInOut" },
    },
    exit: (dir) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: TRANSITION_DURATION, ease: "easeInOut" },
    }),
  };

  const textVariants = {
    enter: (dir) => ({ x: dir > 0 ? "50%" : "-50%", opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: TRANSITION_DURATION + 0.2, ease: "easeInOut" },
    },
    exit: (dir) => ({
      x: dir > 0 ? "-50%" : "50%",
      opacity: 0,
      transition: { duration: TRANSITION_DURATION + 0.2, ease: "easeInOut" },
    }),
  };

  return (
    <div className="relative max-w-full md:min-h-screen md:max-w-6xl rounded-lg overflow-hidden flex flex-col md:flex-row h-[450px] gap-8 md:h-[500px] md:mx-24 mx-4 p-4">
      {/* TEXT SECTION */}
      <div className="relative flex-1 flex flex-col justify-center md:p-10 overflow-hidden">
        <h3 className="absolute md:top-30 top-0 left-0 md:left-10 text-sm font-medium">ABOUT US</h3>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full md:pr-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#4b3d2a]">
              {slides[index].title}
            </h2>
            <p className="text-base md:text-lg text-[#6a5d4b]">
              {slides[index].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* IMAGE SECTION */}
      <div className="relative flex-1 h-[250px] md:min-h-120 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={index}
            src={slides[index].image}
            alt={slides[index].title}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-fit h-100 md:top-20 rounded object-contain"
          />
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 md:gap-4">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                clearTimeout(timeoutRef.current);
                setIndex(i);
              }}
              className="relative w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-black/70 cursor-pointer flex items-center justify-center"
            >
              {i === index && (
                <motion.div
                  key={index}
                  className="absolute w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                />
              )}
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
