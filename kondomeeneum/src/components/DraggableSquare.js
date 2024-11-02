import React, { useState } from 'react';

const DraggableSquare = () => {
  return (
    <>
      <div
        className="absolute w-24 h-24 bg-blue-500 cursor-move rounded shadow-lg hover:shadow-xl transition-shadow"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
      />
    </>
  );
};

export default DraggableSquare;
