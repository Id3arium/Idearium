import React from 'react';

const GlowBorders = ({
  top = true,
  right = true,
  bottom = true,
  left = true,
  width = 2,
  color = 'white',
  transitionDuration = 100,
  className = ''
}) => {
  const borderStyles = [
    { visible: top, position: 'left-0 right-0 top-0', gradient: 'top' },
    { visible: right, position: 'top-0 bottom-0 right-0', gradient: 'right' },
    { visible: bottom, position: 'left-0 right-0 bottom-0', gradient: 'bottom' },
    { visible: left, position: 'top-0 bottom-0 left-0', gradient: 'left' },
  ];

  return (
    <div id="glow-borders">
      {borderStyles.map((border, index) => (
        <div
            key={index}
            className={`
                absolute ${border.position} ${border.gradient} blur-[2px]
                ${border.visible ? 'opacity-100' : 'opacity-0'}
                ${className}
            `}
            style={{
                width: border.position.includes('left-0 right-0') ? '100%' : `${width}px`,
                height: border.position.includes('top-0 bottom-0') ? '100%' : `${width}px`,
                background: `linear-gradient(to ${border.gradient}, ${color}, transparent)`,
                transition: `opacity ${transitionDuration}ms`
            }}
        />
      ))}
    </div>
  );
};

export default GlowBorders;
export { GlowBorders };