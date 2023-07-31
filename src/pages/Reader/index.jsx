/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import styles from './reader.module.css';

export default function Reader() {
  const [text, setText] = useState('');
  const [sentences, setSentences] = useState([]);
  const [highlightedSentence, setHighlightedSentence] = useState(-1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState();

  useEffect(() => {
    function handleVoicesChanged() {
      const speechSynthesisVoices = speechSynthesis.getVoices();
      if (speechSynthesisVoices.length > 0) {
        setVoices(speechSynthesisVoices);
        setSelectedVoice(speechSynthesisVoices[0]);
      }
    }

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, []);

  useEffect(() => {
    let taggedText = text;

    taggedText = taggedText.replace(/\./g, '.<end>');
    taggedText = taggedText.replace(/,/g, '.<end>');
    taggedText = taggedText.replace(/;/g, '.<end>');

    setSentences(taggedText.split(/<end>/g));
  }, [text]);

  const speak = (input) => {
    const utterance = new SpeechSynthesisUtterance(input);
    utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <textarea id={styles['text-input']} type="text" value={text} onChange={({ target }) => setText(target.value)} />
      <div id={styles['text-container']}>
        <p translate="no" className="notranslate">
          {
            sentences.map((sentence, index) => (
              <>
                <span
                  className={`${styles.sentence}${(highlightedSentence === index) ? ` ${styles['highlighted-text']}` : ''}`}
                  onMouseEnter={() => setHighlightedSentence(index)}
                  onMouseLeave={() => setHighlightedSentence(-1)}
                  onClick={() => speak(sentence)}
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
      <select onChange={({ target }) => setSelectedVoice(voices[target.value])}>
        {
          voices.map((voice, index) => (
            <option
              key={voice.voiceURI}
              value={index}
            >
              {voice.voiceURI}
            </option>
          ))
        }
      </select>
      <button type="button" onClick={() => speak(text)}>Speak</button>
    </div>
  );
}
