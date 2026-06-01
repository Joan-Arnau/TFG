import React from 'react';
export const Ionicons = ({ name, size, color, style }) => {
  return React.createElement('span', { 
    'data-testid': `icon-${name}`, 
    style: { color, fontSize: size, ...style } 
  });
};
