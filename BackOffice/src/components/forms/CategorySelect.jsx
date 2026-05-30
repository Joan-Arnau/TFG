import { useTranslation } from 'react-i18next';

const CategorySelect = ({ categories, value, onChange, placeholder }) => {
  const { i18n } = useTranslation();

  return (
    <select className="form-input" value={value} onChange={onChange}>
      <option value="">{placeholder}</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name[i18n.language] || cat.name.en || cat.name.es || cat.name.ca}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
