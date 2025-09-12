import { useState, useEffect } from 'react';
import { topProduct } from '../details';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TopProduct = () => {
    const categories = Object.keys(topProduct);
    const [category, setCategory] = useState(categories[0]);
    const [scrollPosition, setScrollPosition] = useState(0);

    const visibleCategories = categories.slice(scrollPosition, scrollPosition + 4);

    const handleNext = () => {
        const container = document.getElementById('category-container');
        if (scrollPosition + 4 < categories.length) {
            container.scrollBy({
                left: container.offsetWidth,
                behavior: 'smooth'
            });
            setScrollPosition(scrollPosition + 4);
        }
    };

    const handlePrev = () => {
        const container = document.getElementById('category-container');
        if (scrollPosition - 4 >= 0) {
            container.scrollBy({
                left: -container.offsetWidth,
                behavior: 'smooth'
            });
            setScrollPosition(scrollPosition - 4);
        }
    };

    const handleCategoryClick = (key) => {
        setCategory(key);
    };

    useEffect(() => {
        setScrollPosition(0);
    }, [category]);

    return (
        <div className='flex flex-col gap-4 md:px-12 px-4 py-12 overflow-hidden'>
            <div className='flex flex-col md:flex-row items-center justify-between'>
                <h3 className='text-[#9C1137] text-xl font-medium'>Top Product</h3>
            <div className='flex flex-row-reverse md:gap-8 gap-4 items-center'>
                <div className="flex justify-center gap-4">
                    <ChevronLeft onClick={handlePrev} className='cursor-pointer border border-zinc-400' />
                    <ChevronRight onClick={handleNext} className='cursor-pointer border border-zinc-400' />
                </div>

                <div
                    id="category-container"
                    className="flex md:gap-2 gap-1 overflow-x-auto scroll-smooth md:text-sm text-xs"
                >
                    {visibleCategories.map((key) => (
                        <div
                            key={key}
                            className={`cursor-pointer p-2
                            ${category === key ? 'text-[#9C1137] underline underline-offset-8' : 'text-[#958F86]'}`
                            }
                            onClick={() => handleCategoryClick(key)}
                        >
                            {key}
                        </div>
                    ))}
                </div>
            </div>
            </div>

            {category && (
                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {topProduct[category].map((item, index) => (
                            <div key={index} className="text-center flex flex-col gap-2">
                                <img src={item.image} alt={item.name} className="w-full h-52 object-cover mb-2" />
                                <p className='text-[#383434]'>{item.name}</p>
                                <span className='text-[#958F86] cursor-pointer text-sm'>Shop Now</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopProduct;
