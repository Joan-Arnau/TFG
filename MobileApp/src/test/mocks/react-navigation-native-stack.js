import React from 'react';
export const createNativeStackNavigator = () => ({
  Navigator: ({ children }) => React.createElement('div', null, children),
  Screen: ({ name, component: Component }) => {
    return React.createElement('div', { 'data-testid': `screen-${name}` }, 
      name === 'Dashboard' ? React.createElement(Component) : null
    );
  },
});
