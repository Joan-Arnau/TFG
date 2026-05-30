const DateTimePicker = ({ selected, onChange, showTimeSelect }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value) {
      onChange(new Date(value));
    } else {
      onChange(null);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <input
      type={showTimeSelect ? "datetime-local" : "date"}
      className="form-input"
      value={selected ? formatDateTime(selected) : ''}
      onChange={handleChange}
      min="1000-01-01"
      max="9999-12-31"
    />
  );
};

export default DateTimePicker;
