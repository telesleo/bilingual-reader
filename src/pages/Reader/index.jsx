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
  const [isPlaying, setIsPlaying] = useState(false);

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
    taggedText = taggedText.replace(/\?/g, '?<end>');
    taggedText = taggedText.replace(/!/g, '!<end>');
    taggedText = taggedText.replace(/,/g, ',<end>');
    taggedText = taggedText.replace(/;/g, ';<end>');

    setSentences(taggedText.split(/<end>/g));
  }, [text]);

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const speak = (input) => {
    speechSynthesis.cancel();

    const utterances = input.map((inputSentence) => {
      const utterance = new SpeechSynthesisUtterance(inputSentence);
      utterance.voice = selectedVoice;
      return utterance;
    });

    for (let index = utterances.length - 1; index >= 0; index -= 1) {
      if (index === utterances.length - 1) {
        const onLastSentenceEnd = () => {
          stop();
          utterances[index].removeEventListener('end', onLastSentenceEnd);
        };
        utterances[index].addEventListener('end', onLastSentenceEnd);
      } else {
        const onSentenceEnd = () => {
          speechSynthesis.speak(utterances[index + 1]);
          utterances[index].removeEventListener('end', onSentenceEnd);
        };
        utterances[index].addEventListener('end', onSentenceEnd);
      }
    }

    speechSynthesis.speak(utterances[0]);

    setIsPlaying(true);
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
                  onClick={() => speak([sentence])}
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
      <button
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
