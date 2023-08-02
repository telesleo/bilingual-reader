import React, { useEffect, useState } from 'react';
import styles from './reader.module.css';

export default function Reader() {
  const [newText, setNewText] = useState('');
  const [texts, setTexts] = useState(() => localStorage.getItem('bilingual-reader-texts') || []);
  const [selectedText, setSelectedText] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [highlightedSentence, setHighlightedSentence] = useState(-1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('bilingual-reader-dark-mode')));

  useEffect(() => {
    function handleVoicesChanged() {
      const speechSynthesisVoices = speechSynthesis.getVoices();
      if (speechSynthesisVoices.length > 0) {
        setVoices(speechSynthesisVoices);
        const storedVoiceURI = localStorage.getItem('bilingual-reader-voice');
        const storedVoice = speechSynthesisVoices.find(
          (voice) => voice.voiceURI === storedVoiceURI,
        );
        setSelectedVoice(storedVoice || speechSynthesisVoices[0]);
      }
    }

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, []);

  useEffect(() => {
    if (!texts[selectedText]) return;

    let taggedText = texts[selectedText];

    taggedText = taggedText.replace(/\./g, '.<end>');
    taggedText = taggedText.replace(/\?/g, '?<end>');
    taggedText = taggedText.replace(/!/g, '!<end>');
    taggedText = taggedText.replace(/,/g, ',<end>');
    taggedText = taggedText.replace(/;/g, ';<end>');

    setSentences(taggedText.split(/<end>/g));

    localStorage.setItem('bilingual-reader-text', texts);
  }, [selectedText, texts]);

  useEffect(() => {
    setSelectedText(texts.length - 1);
  }, [texts]);

  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('bilingual-reader-voice', selectedVoice.voiceURI);
    }
  }, [selectedVoice]);

  useEffect(() => {
    localStorage.setItem('bilingual-reader-dark-mode', darkMode);
  }, [darkMode]);

  const addText = () => {
    if (!newText) return;

    setTexts((prevTexts) => [...prevTexts, newText]);

    setNewText('');
  };

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

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const handleTextInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addText();
    }
  };

  return (
    <div id={styles.reader} className={darkMode ? styles['dark-mode'] : ''}>
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
      { (texts[selectedText]) && (
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
      ) }
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
      <button id={styles['dark-mode-button']} type="button" onClick={toggleDarkMode}>
        {(darkMode) ? (
          <span className="material-symbols-outlined">
            light_mode
          </span>
        ) : (
          <span className="material-symbols-outlined">
            dark_mode
          </span>
        )}

      </button>
    </div>
  );
}
