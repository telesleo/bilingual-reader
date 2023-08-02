import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './text-input.module.css';

export default function TextInput({ setTexts, setSelectedText }) {
  const [newText, setNewText] = useState('');

  const findNextId = (texts) => {
    const ids = Object.keys(texts);

    return parseInt(ids[ids.length - 1], 10) + 1 || 0;
  };

  const addText = () => {
    if (!newText) return;

    setTexts((prevTexts) => {
      const id = findNextId(prevTexts);
      setSelectedText(id);
      return { ...prevTexts, [id]: newText };
    });

    setNewText('');
  };

  const handleTextInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addText();
    }
  };

  return (
    <div id={styles['text-input-container']}>
      <textarea
        id={styles['text-input']}
        className={styles['voice-select']}
        type="text"
        value={newText}
        onChange={({ target }) => setNewText(target.value)}
        onKeyDown={handleTextInputKeyDown}
        rows={1}
        style={{
          height: (newText.length > 0) ? '200px' : 'inherit',
        }}
      />
      { (newText.length > 0) && (
      <button type="button" onClick={addText}>Add Text</button>
      ) }
    </div>
  );
}

TextInput.propTypes = {
  setTexts: PropTypes.func.isRequired,
  setSelectedText: PropTypes.func.isRequired,
};
