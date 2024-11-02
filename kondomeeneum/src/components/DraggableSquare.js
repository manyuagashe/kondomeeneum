import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const DraggableSquares = () => {
  const [squares, setSquares] = useState([
    { id: 1, x: 100, y: 100, color: 'bg-blue-500' }
  ]);
  const [dragInfo, setDragInfo] = useState(null);

  const colors = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500',
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ];

  const addSquare = () => {
    const newId = Math.max(0, ...squares.map(s => s.id)) + 1;
    const randomColor = colors[squares.length % colors.length];
    setSquares([...squares, {
      id: newId,
      x: 150 + (squares.length * 30),
      y: 150 + (squares.length * 30),
      color: randomColor
    }]);
  };

  const removeSquare = (id) => {
    setSquares(squares.filter(square => square.id !== id));
  };

  const handleMouseDown = (e, id) => {
    const square = squares.find(s => s.id === id);
    const rect = e.target.getBoundingClientRect();
    setDragInfo({
      id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      initialX: square.x,
      initialY: square.y
    });
  };

  const handleMouseMove = (e) => {
    if (!dragInfo) return;

    const newX = e.clientX - dragInfo.offsetX;
    const newY = e.clientY - dragInfo.offsetY;

    setSquares(squares.map(square => 
      square.id === dragInfo.id
        ? { ...square, x: newX, y: newY }
        : square
    ));
  };

  const handleMouseUp = () => {
    setDragInfo(null);
  };

  return (
    <div 
      className="relative w-screen h-screen bg-gray-100"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {squares.map(square => (
        <div
          key={square.id}
          className={`absolute w-24 h-24 cursor-move rounded shadow-lg hover:shadow-xl transition-shadow ${square.color}`}
          style={{
            left: `${square.x}px`,
            top: `${square.y}px`,
            touchAction: 'none',
          }}
          onMouseDown={(e) => handleMouseDown(e, square.id)}
        >
          <button
            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow hover:bg-red-100"
            onClick={(e) => {
              e.stopPropagation();
              removeSquare(square.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      ))}

      <div className="fixed bottom-4 right-4 space-y-4">
        <button
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-50"
          onClick={addSquare}
        >
          <Plus className="w-6 h-6" />
        </button>

        <div className="bg-white p-4 rounded shadow space-y-2">
          <div className="font-medium">Square Positions:</div>
          {squares.map(square => (
            <div key={square.id} className="text-sm">
              Square {square.id}: ({Math.round(square.x)}, {Math.round(square.y)})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DraggableSquares;