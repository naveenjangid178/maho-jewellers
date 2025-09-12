import { Search } from 'lucide-react';
import React from 'react'

const SearchInput = ({ searchQuery, setSearchQuery }) => {
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            alert(`Searching for: ${searchQuery}`);
            setSearchQuery("");
        }
    };

    return (
        <div className='rounded p-2 bg-[#F6F3EE] w-1/2 md:flex gap-6 hidden'>
        <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className='outline-none w-full px-4 text-[#958F86] text-sm'
            id='search'
            placeholder='What are you looking for Today? e.g dimond ring'
        />
        <label htmlFor="search"><Search width={21} /></label>
        </div>
    )
}

export default SearchInput