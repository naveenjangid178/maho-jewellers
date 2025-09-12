import React from "react";
import { InfiniteMovingCards } from "./InfiniteMovingCards ";

export function Testimonials() {
    return (
        <div
            className="h-[30rem] justify-around rounded-md flex flex-col antialiased bg-white items-center relative overflow-hidden">
            <h2 className="md:text-3xl text-2xl font-semibold">Trusted by our community</h2>
            <InfiniteMovingCards items={testimonials} direction="left" speed="slow" />
        </div>
    );
}

const testimonials = [
    {
        rating: 5,
        quote:
            "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
        name: "Charles Dickens",
        title: "A Tale of Two Cities",
    },
    {
        rating: 4,
        quote:
            "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
        name: "William Shakespeare",
        title: "Hamlet",
    },
    {
        rating: 5,
        quote: "All that we see or seem is but a dream within a dream.",
        name: "Edgar Allan Poe",
        title: "A Dream Within a Dream",
    },
    {
        rating: 5,
        quote:
            "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        name: "Jane Austen",
        title: "Pride and Prejudice",
    },
    {
        rating: 5,
        quote:
            "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
        name: "Herman Melville",
        title: "Moby-Dick",
    },
];
