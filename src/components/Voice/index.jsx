import React from 'react';
import PropTypes from 'prop-types';
import styles from './voice.module.css';

export default function Voice({
  voices, selectedVoice, setSelectedVoice, sentences, isPlaying, speak, stop,
}) {
  return (
    <div id={styles['voice-container']}>
      <select
        translate="no"
        className={`${'notranslate'} ${styles['voice-select']}`}
        value={selectedVoice?.voiceURI}
        onChange={({ target }) => setSelectedVoice(
          voices.find((voice) => voice.voiceURI === target.value),
        )}
      >
        {
          voices.map((voice) => (
            <option
              key={voice.voiceURI}
            >
              {voice.voiceURI}
            </option>
          ))
        }
      </select>
      <button
        translate="no"
        className={`${'notranslate'} ${styles['speak-button']}`}
        type="button"
        onClick={() => {
          if (isPlaying) stop();
          else speak(sentences);
        }}
      >
        {(isPlaying) ? 'Stop' : 'Speak'}
      </button>
    </div>
  );
}

Voice.propTypes = {
  voices: PropTypes.arrayOf(PropTypes.shape({
    voiceURI: PropTypes.string,
  })).isRequired,
  selectedVoice: PropTypes.shape({
    voiceURI: PropTypes.string,
  }).isRequired,
  setSelectedVoice: PropTypes.func.isRequired,
  sentences: PropTypes.arrayOf(PropTypes.string).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  speak: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
};
