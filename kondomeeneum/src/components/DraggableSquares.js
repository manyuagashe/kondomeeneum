import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import Walls from './Walls';

const DraggableSquares = () => {
  const currRef = useRef(null);
  const editorRef = useRef(null);
  const [selected, setSelected] = useState(null)
  const [input, setInput] = useState(null);
  const [roomDims, setRoomDims] = useState({ width: 500, height: 300 });
  const [roomInput, setRoomInput] = useState({ ...roomDims });
  const [squares, setSquares] = useState([
    {
      id: 1,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      color: 'bg-blue-500',
      rotation: 0,
      svgPath: '/couch.svg',
    }
  ]);
  const [dragInfo, setDragInfo] = useState(null);
  const [isRotating, setIsRotating] = useState(false);

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ];

  useEffect(() => {
    const callback = (e) => {
      if (currRef.current && !currRef.current.contains(e.target) && !editorRef.current.contains(e.target)) {
        setSelected(null)
      }
    }
    document.addEventListener('click', callback, true)
    return () => {
      document.removeEventListener('click', callback, true)
    }
  })

  const addSquare = () => {
    const newId = Math.max(0, ...squares.map(s => s.id)) + 1;
    const randomColor = colors[squares.length % colors.length];
    setSquares([...squares, {
      id: newId,
      x: 150 + (squares.length * 30),
      y: 150 + (squares.length * 30),
      width: 100,
      height: 100,
      color: randomColor,
      rotation: 0
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
    setSelected(id);
    setInput({ width: square.width, height: square.height, rotation: square.rotation })
  };

  const handleRotateStart = (e, id) => {
    e.stopPropagation();
    setIsRotating(true);
    setSelected(id);
    const square = squares.find(s => s.id === id);
    const rect = currRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    setDragInfo({
      id,
      initialAngle,
      initialRotation: square.rotation
    });
  };

  const handleMouseMove = (e) => {
    if (!dragInfo) return;

    if (isRotating) {
      const rect = currRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const angleDiff = (currentAngle - dragInfo.initialAngle) * (180 / Math.PI);
      let newRotation = (((dragInfo.initialRotation + angleDiff) % 360) + 360) % 360;
      const snaps = [0, 90, 180, 270]
      snaps.forEach(element => {
        if (newRotation < element + 10 && newRotation > element - 10) {
          newRotation = element;
        }
      });

      setSquares(squares.map(square =>
        square.id === dragInfo.id
          ? { ...square, rotation: newRotation }
          : square
      ));
      setInput(prev => ({ ...prev, rotation: newRotation }));
    } else {
      const newX = e.clientX - dragInfo.offsetX;
      const newY = e.clientY - dragInfo.offsetY;

      setSquares(squares.map(square =>
        square.id === dragInfo.id
          ? { ...square, x: newX, y: newY }
          : square
      ));
    }
  };

  const handleMouseUp = () => {
    setDragInfo(null);
    setIsRotating(false);
  };

  const handleChange = (e, field) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) {
      value = ''
    }
    setInput(prev => ({ ...prev, [field]: value }))
  }

  const handleBlur = () => {
    if (selected && input) {
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isNaN(input.width) || isNaN(input.height) || isNaN(input.rotation)) return;

    const validatedInput = {
      width: Math.max(1, Math.min(2000, parseInt(input.width))),
      height: Math.max(1, Math.min(2000, parseInt(input.height))),
      rotation: ((parseInt(input.rotation) % 360) + 360) % 360
    };

    setInput(validatedInput);
    setSquares(prev =>
      prev.map(s =>
        s.id === selected
          ? { ...s, ...validatedInput }
          : s
      )
    );
  };

  const handleRoomChange = (e, field) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) {
      value = ''
    }
    setRoomInput(prev => ({ ...prev, [field]: value }))
  }

  const handleRoomBlur = () => {
    if (selected && roomInput) {
      handleRoomSubmit();
    }
  };

  const handleRoomSubmit = (e) => {
    if (e) e.preventDefault();
    if (isNaN(roomInput.width) || isNaN(roomInput.height)) return;

    const validatedInput = {
      width: Math.max(1, Math.min(2000, parseInt(roomInput.width))),
      height: Math.max(1, Math.min(2000, parseInt(roomInput.height))),
    };

    setRoomInput({ ...validatedInput });
    setRoomDims({ ...validatedInput });
  };

  return (
    <div
      className="relative w-screen h-screen bg-gray-100"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Walls width={roomDims.width} height={roomDims.height} />
      {squares.map(square => (
        <div
          key={square.id}
          ref={square.id === selected ? currRef : null}
          className={`absolute cursor-move rounded ${square.id === selected && 'outline-dashed outline-blue-400 outline-2'}`}
          style={{
            left: `${square.x}px`,
            top: `${square.y}px`,
            touchAction: 'none',
            width: `${square.width}px`,
            height: `${square.height}px`,
            transform: `rotate(${square.rotation}deg)`,
          }}
          onMouseDown={(e) => handleMouseDown(e, square.id)}
        >
          <div className="w-full h-full relative">
            <img
              src={square.svgPath}
              alt="Furniture item"
              className="w-full h-full object-contain select-none pointer-events-none"
              draggable="false"
            />
          </div>
          {square.id === selected && (
            <>
              <button
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSquare(square.id);
                }}
              >
                <Trash2
                  className="w-4 h-4 text-red-500"
                  style={{
                    transform: `rotate(${-square.rotation}deg)`
                  }}
                />
              </button>
              <button
                className="absolute -top-2 -left-2 p-1 bg-white rounded-full shadow hover:bg-blue-100 cursor-pointer"
                onMouseDown={(e) => handleRotateStart(e, square.id)}
              >
                <RotateCcw
                  className="w-4 h-4 text-blue-500"
                  style={{
                    transform: `rotate(${-square.rotation}deg)`
                  }}
                />
              </button>
            </>
          )}
        </div>
      ))}

      <div ref={editorRef} className="fixed bottom-4 right-4 flex flex-row items-end">
        <div className="text-black p-4 rounded shadow space-y-4 flex flex-col">
          <div className="font-medium p-0">Item Dimensions:</div>
          {!selected ? (
            <div className='text-sm text-gray-600'>Nothing selected</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='text-sm'>
                <label htmlFor='width' className='pr-6'>Width: </label>
                <input
                  className='bg-transparent max-w-16 border border-black border-solid rounded overflow-auto'
                  type='text'
                  id='width'
                  value={input.width}
                  onChange={(e) => handleChange(e, 'width')}
                  onBlur={handleBlur}
                />
              </div>
              <div className='text-sm'>
                <label htmlFor='height' className='pr-5'>Height: </label>
                <input
                  className='bg-transparent max-w-16 border border-black border-solid rounded overflow-auto'
                  type='text'
                  id='height'
                  value={input.height}
                  onChange={(e) => handleChange(e, 'height')}
                  onBlur={handleBlur}
                />
              </div>
              <div className='text-sm'>
                <label htmlFor='rotation' className='pr-2'>Rotation: </label>
                <input
                  className='bg-transparent max-w-16 border border-black border-solid rounded overflow-auto'
                  type='text'
                  id='rotation'
                  value={Math.round(input.rotation)}
                  onChange={(e) => handleChange(e, 'rotation')}
                  onBlur={handleBlur}
                />
              </div>
              <button type="submit" className="hidden" aria-hidden="true" />
            </form>
          )}
        </div>
        <div className='space-y-4'>
          <button
            className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-50"
            onClick={addSquare}
          >
            <Plus className="text-black w-6 h-6" />
          </button>
          <div className="text-black p-4 rounded shadow space-y-2">
            <div className="font-medium">Room Dimensions:</div>
            <form onSubmit={handleRoomSubmit}>
              <div className='text-sm'>
                <label htmlFor='width' className='pr-3'>Width: </label>
                <input
                  className='bg-transparent max-w-16 border border-black border-solid rounded overflow-auto'
                  type='text'
                  id='width'
                  value={roomInput.width}
                  onChange={(e) => handleRoomChange(e, 'width')}
                  onBlur={handleRoomBlur}
                />
              </div>
              <div className='text-sm'>
                <label htmlFor='height' className='pr-2'>Height: </label>
                <input
                  className='bg-transparent max-w-16 border border-black border-solid rounded overflow-auto'
                  type='text'
                  id='height'
                  value={roomInput.height}
                  onChange={(e) => handleRoomChange(e, 'height')}
                  onBlur={handleRoomBlur}
                />
              </div>
              <button type="submit" className="hidden" aria-hidden="true" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableSquares;