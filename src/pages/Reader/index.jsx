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

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <textarea type="text" value={text} onChange={({ target }) => setText(target.value)} />
      <div id={styles['text-container']}>
        <p translate="no" className="notranslate">
          {
            sentences.map((sentence, index) => (
              <>
                <span
                  onMouseEnter={() => setHighlightedSentence(index)}
                  onMouseLeave={() => setHighlightedSentence(-1)}
                  className={`${styles.sentence}${(highlightedSentence === index) ? ` ${styles['highlighted-text']}` : ''}`}
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
                  onMouseEnter={() => setHighlightedSentence(index)}
                  onMouseLeave={() => setHighlightedSentence(-1)}
                  className={`${styles.sentence}${(highlightedSentence === index) ? ` ${styles['highlighted-text']}` : ''}`}
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
      <button type="button" onClick={speak}>Speak</button>
    </div>
  );
}
