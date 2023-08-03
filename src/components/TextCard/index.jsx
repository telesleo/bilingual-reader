import React from 'react';
import PropTypes from 'prop-types';
import styles from './text-card.module.css';

export default function TextCard({ text, onClick, onDelete }) {
  return (
    <div className={styles['text-card']}>
      <button
        type="button"
        className={styles.preview}
        onClick={onClick}
      >
        <div className={styles['text-preview']}>
          {text}
        </div>
      </button>
      <button className={styles['delete-button']} type="button" onClick={onDelete}>
        <span className="material-symbols-outlined">
          delete
        </span>
      </button>
    </div>
  );
}

TextCard.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
