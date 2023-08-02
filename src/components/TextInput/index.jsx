import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './text-input.module.css';

export default function TextInput({ setTexts }) {
  const [newText, setNewText] = useState('');

  const addText = () => {
    if (!newText) return;

    setTexts((prevTexts) => [...prevTexts, newText]);

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
      />
      { (newText.length > 0) && (
      <button type="button" onClick={addText}>Add Text</button>
      ) }
    </div>
  );
}

TextInput.propTypes = {
  setTexts: PropTypes.func.isRequired,
};
