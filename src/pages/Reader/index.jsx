import React, { useEffect, useState } from 'react';

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
      <p>{text}</p>
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
