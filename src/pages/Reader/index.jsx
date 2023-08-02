import React, { useEffect, useState } from 'react';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import Voice from '../../components/Voice';
import '../../dark-mode.css';
import styles from './reader.module.css';

export default function Reader() {
  const [texts, setTexts] = useState(() => JSON.parse(localStorage.getItem('bilingual-reader-texts')) || {});
  const [selectedText, setSelectedText] = useState(localStorage.getItem('bilingual-reader-selected-text'));
  const [sentences, setSentences] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('bilingual-reader-dark-mode')));

  useEffect(() => {
    function handleVoicesChanged() {
      const speechSynthesisVoices = speechSynthesis.getVoices();
      if (speechSynthesisVoices.length > 0) {
        setVoices(speechSynthesisVoices);
        const storedVoiceURI = localStorage.getItem('bilingual-reader-selected-voice');
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

    localStorage.setItem('bilingual-reader-texts', JSON.stringify(texts));
  }, [selectedText, texts]);

  useEffect(() => {
    if (!selectedText) return;

    if (selectedVoice) {
      localStorage.setItem('bilingual-reader-selected-text', selectedText);
    }
  }, [selectedText]);

  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('bilingual-reader-selected-voice', selectedVoice.voiceURI);
    }
  }, [selectedVoice]);

  useEffect(() => {
    localStorage.setItem('bilingual-reader-dark-mode', darkMode);
  }, [darkMode]);

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const speak = (input) => {
    if (input.length <= 0) return;

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

  return (
    <div id={styles.reader} className={darkMode ? 'dark-mode' : ''}>
      <TextInput setTexts={setTexts} setSelectedText={setSelectedText} />
      { (texts[selectedText]) && (
        <Text sentences={sentences} speak={speak} isPlaying={isPlaying} />
      ) }
      <Voice
        voices={voices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        sentences={sentences}
        isPlaying={isPlaying}
        speak={speak}
        stop={stop}
      />
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
