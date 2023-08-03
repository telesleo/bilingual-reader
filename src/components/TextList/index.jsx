import React from 'react';
import PropTypes from 'prop-types';
import TextCard from '../TextCard';
import styles from './text-list.module.css';

export default function TextList({ texts, setTexts, setSelectedText }) {
  const deleteText = (id) => {
    setTexts((prevTexts) => {
      const updatedTexts = { ...prevTexts };
      delete updatedTexts[id];
      return updatedTexts;
    });
  };

  return (
    <div className={styles['text-list']}>
      {
        Object.entries(texts).map(
          (text) => (
            <TextCard
              text={text[1]}
              onClick={() => setSelectedText(text[0])}
              onDelete={() => deleteText(text[0])}
            />
          ),
        )
      }
    </div>
  );
}

TextList.propTypes = {
  texts: PropTypes.objectOf(PropTypes.string).isRequired,
  setTexts: PropTypes.func.isRequired,
  setSelectedText: PropTypes.func.isRequired,
};
