import { useState } from "react"

const Walls = ({ width, height }) => {
    const [corner, setCorner] = useState({
        x: 50,
        y: 50
    })
    const corners = [
        corner,
        { y: corner.y, x: corner.x + width },
        { y: corner.y + height, x: corner.x + width },
        { y: corner.y + height, x: corner.x },
    ]
    const radius = 12;
    const wallWidth = 10;

    return (
        <>
          <div 
              className={`absolute rounded-full shadow-lg hover:shadow-xl transition-shadow bg-gray-800`}
              style={{
                left: `${corner.x + radius - wallWidth/2}px`,
                top: `${corner.y + radius - wallWidth/2}px`,
                touchAction: 'none',
                width: `${width}px`,
                height: `${wallWidth}px`,
              }}
          />
          <div 
              className={`absolute rounded-full shadow-lg hover:shadow-xl transition-shadow bg-gray-800`}
              style={{
                left: `${corners[3].x + radius - wallWidth/2}px`,
                top: `${corners[3].y + radius - wallWidth/2}px`,
                touchAction: 'none',
                width: `${width}px`,
                height: `${wallWidth}px`,
              }}
          />
          <div 
              className={`absolute rounded-full shadow-lg hover:shadow-xl transition-shadow bg-gray-800`}
              style={{
                left: `${corner.x + radius - wallWidth/2}px`,
                top: `${corner.y + radius - wallWidth/2}px`,
                touchAction: 'none',
                width: `${wallWidth}px`,
                height: `${height}px`,
              }}
          />
          <div 
              className={`absolute rounded-full shadow-lg hover:shadow-xl transition-shadow bg-gray-800`}
              style={{
                left: `${corners[1].x + radius - wallWidth/2}px`,
                top: `${corners[1].y + radius - wallWidth/2}px`,
                touchAction: 'none',
                width: `${wallWidth}px`,
                height: `${height}px`,
              }}
          />
          {corners.map((c, i) => (
            <div
              key={i}
              className={`absolute rounded-full shadow-lg hover:shadow-xl transition-shadow bg-gray-500`}
              style={{
                left: `${c.x}px`,
                top: `${c.y}px`,
                touchAction: 'none',
                width: `${radius * 2}px`,
                height:`${radius * 2}px`,
              }}
            />
          ))}
        </>
    );
}

export default Walls