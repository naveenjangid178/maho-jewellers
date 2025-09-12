import React, { useState } from 'react';

const Header = ({ selected, setSelected, createOption, setCreateOption }) => {
  const menuItems = ['Users', 'Products', 'Catalogue'];

  const handleChange = (e) => {
    setCreateOption(e.target.value);
  };

  return (
    <div className='bg-gray-950 flex justify-between items-center lg:px-12 md:px-8 px-2 py-4 text-white'>
      <h2 className='font-medium text-xl'>Admin</h2>
      <ul className="flex md:gap-12 list-none transition-all duration-300 ease-in-out">
        {menuItems.map((item) => (
          <li
            key={item}
            onClick={() => setSelected(item)}
            className={`cursor-pointer transition-all duration-300 ease-in-out 
            ${selected === item ? 'text-gray-300' : 'text-white'}
            hover:text-gray-300 hover:scale-105`}
          >
            {item}
          </li>
        ))}
      </ul>
      <select
        value={createOption}
        onChange={handleChange}
        className='px-2 py-1.5 rounded bg-blue-700 cursor-pointer appearance-none text-center outline-none'
      >
        <option value="">Create</option>
        <option value="product">Product</option>
        <option value="catalogue">Catalogue</option>
      </select>
    </div>
  );
};

export default Header;
