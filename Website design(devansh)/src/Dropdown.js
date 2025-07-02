import React, { useState } from 'react';

const Dropdown = ({ options, onSelect }) => {
  const [selected, setSelected] = useState(options[0]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    onSelect(value);
  };

  return (
    <div>
      <label htmlFor="dropdown">Choose an option:</label>
      <select id="dropdown" value={selected} onChange={handleChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
