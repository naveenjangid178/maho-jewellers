import React from "react";
import { InfiniteMovingCards } from "./InfiniteMovingCards ";

export function Testimonials() {
    const testimonials = [
        './t1.png',
        './t2.png',
        './t3.png',
        './t4.png',
        './t5.png',
    ]

    // const fetchTestimonials = async () => {
    //     try {
    //         const res = await axios.get(`${import.meta.env.VITE_API_URL}/testimonial/`);
    //         setTestimonials(res.data);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    // useEffect(() => {
    //     fetchTestimonials();
    // }, []);

    return (
        <div
            className="h-[30rem] justify-around rounded-md flex flex-col gap-8 antialiased bg-white items-center relative overflow-hidden my-12">
            <h2 className="md:text-3xl text-2xl font-[Platypi]">Trusted by our community</h2>
            <InfiniteMovingCards items={testimonials} direction="left" speed="slow" />
        </div>
    );
}
