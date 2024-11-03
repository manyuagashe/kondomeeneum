"use client";
import React from 'react';

const Sidebar = () => {
  const furnitureItems = [
    'Bed',
    'Table',
    'Couch',
    'Bookshelf',
    'Chair',
    'Dresser',
    'Desk',
    'Nightstand',
    'Ottoman',
    'Wardrobe'
  ];

  return (
    <aside className="bg-emerald-800 h-screen w-64 flex-shrink-0">
      <nav className="py-4">
        {furnitureItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className="flex items-center px-6 py-3 text-white hover:bg-emerald-700 transition-colors duration-200"
          >
            <span className="text-lg">{item}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;