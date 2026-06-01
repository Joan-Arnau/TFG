import React from 'react';
export const NavigationContainer = ({ children }) => React.createElement('div', { 'data-testid': 'navigation-container' }, children);
export const useNavigation = () => ({
  navigate: vi.fn(),
  goBack: vi.fn(),
});
