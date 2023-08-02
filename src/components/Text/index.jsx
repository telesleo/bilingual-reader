import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './text.module.css';

export default function Text({ sentences, speak }) {
  const [highlightedSentence, setHighlightedSentence] = useState(-1);

  return (
    <div id={styles['text-container']}>
      <p translate="no" className="notranslate">
        {
            sentences.map((sentence, index) => (
              <>
                <span
                  className={`${styles.sentence}${(highlightedSentence === index) ? ` ${styles['highlighted-text']}` : ''}`}
                  onMouseEnter={() => setHighlightedSentence(index)}
                  onMouseLeave={() => setHighlightedSentence(-1)}
                  onClick={() => speak([sentence])}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') speak([sentence]);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {sentence}
                </span>
                {index !== sentences.length - 1 && ' '}
              </>
            ))
          }
      </p>
      <p>
        {
            sentences.map((sentence, index) => (
              <>
                <span
                  className={`${styles.sentence}${(highlightedSentence === index) ? ` ${styles['highlighted-text']}` : ''}`}
                  onMouseEnter={() => setHighlightedSentence(index)}
                  onMouseLeave={() => setHighlightedSentence(-1)}
                >
                  {sentence}
                </span>
                {index !== sentences.length - 1 && ' '}
              </>
            ))
          }
      </p>
    </div>
  );
}

Text.propTypes = {
  sentences: PropTypes.arrayOf(PropTypes.string).isRequired,
  speak: PropTypes.func.isRequired,
};
