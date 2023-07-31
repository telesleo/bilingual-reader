import React, { useEffect, useState } from 'react';
import styles from './reader.module.css';

export default function Reader() {
  const [text, setText] = useState('');
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

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <input type="text" value={text} onChange={({ target }) => setText(target.value)} />
      <div id={styles['text-container']}>
        <p translate="no" className="notranslate">{text}</p>
        <p>{text}</p>
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
