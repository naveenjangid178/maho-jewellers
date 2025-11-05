import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./InfiniteMovingCards ";
import axios from "axios";

export function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);

    const fetchTestimonials = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/testimonial/`);
            setTestimonials(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);
    return (
        <div
            className="h-[30rem] justify-around rounded-md flex flex-col antialiased bg-white items-center relative overflow-hidden">
            <h2 className="md:text-3xl text-2xl font-[Platypi]">Trusted by our community</h2>
            <InfiniteMovingCards items={testimonials} direction="left" speed="slow" />
        </div>
    );
}
