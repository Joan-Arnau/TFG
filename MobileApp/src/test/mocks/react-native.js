import React from 'react';
export const View = ({ children, style, ...props }) => React.createElement('div', props, children);
export const Text = ({ children, style, ...props }) => React.createElement('span', props, children);
export const StyleSheet = {
  create: (styles) => styles,
};
export const TouchableOpacity = ({ children, onPress, style, ...props }) => {
  return React.createElement('button', { 
    onClick: onPress, 
    style: { background: 'none', border: 'none', padding: 0, ...style }, 
    ...props 
  }, children);
};
export const ScrollView = ({ children, ...props }) => React.createElement('div', props, children);
export const ActivityIndicator = () => React.createElement('div', { 'data-testid': 'loading' });
export const FlatList = ({ data, renderItem, ListEmptyComponent }) => {
  if (!data || data.length === 0) {
    return ListEmptyComponent ? React.createElement(ListEmptyComponent) : null;
  }
  return React.createElement('div', null, data.map((item, index) => renderItem({ item, index })));
};
export const SectionList = ({ sections, renderItem, renderSectionHeader }) => {
  if (!sections || sections.length === 0) return null;
  return React.createElement('div', null, sections.map((section, sIndex) => 
    React.createElement('div', { key: sIndex }, 
      renderSectionHeader({ section }),
      section.data.map((item, index) => renderItem({ item, index }))
    )
  ));
};
export const Image = ({ source, ...props }) => React.createElement('img', { src: source?.uri, ...props });
export const TextInput = ({ value, onChangeText, ...props }) => React.createElement('input', { value, onChange: (e) => onChangeText(e.target.value), ...props });
export const Platform = { OS: 'web', select: (objs) => objs.web || objs.default };
