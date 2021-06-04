import { useState, useEffect, useRef } from 'react';
import { scrambler, fetchData, formatter } from './utils';
import uuid from 'react-uuid';
import { styler } from './utils/blockHolder';
import { Rows, Winner } from './components';
import { synth } from './utils/sound';
import * as Tone from 'tone';
import { FrequencyEnvelope, Synth } from 'tone';

function App() {
  const [count, setCount] = useState(10);
  const [state, setState] = useState({
    loading: false,
    error: null,
    sentence: [],
  });
  const score = useRef(0);
  const keysPressed = useRef(0);
  const gameBlocks = useRef(null);
  const sentenceRef = useRef(null);
  const scrambledRef = useRef(null);
  const scoreRef = useRef(null);
  const nextButtonRef = useRef(null);
  let { current: runningScore } = score;

  useEffect(() => {
    async function setData() {
      try {
        setState({ loading: true, sentence: '', error: null, count: count });
        const { data } = await fetchData(count);
        setState({
          loading: false,
          sentence: data,
          error: null,
        });
      } catch (err) {
        setState({ loading: false, sentence: [], error: err, count: count });
      }
    }
    if (count < 11) {
      setData();
    }
    window.addEventListener('keypress', onKey);
    return function cleanup() {
      gameBlocks.current = [];
      window.removeEventListener('keypress', onKey);
    };
  }, [count]);

  const { loading, error, sentence } = state;
  const { data } = sentence;

  const onKey = (e) => {
    //if user got all the of letters correct
    if (
      runningScore === gameBlocks.current.length - 1 &&
      gameBlocks.current[keysPressed.current]
    ) {
      if (count === 10) {
        synth.triggerAttackRelease('C6', '10n');
        setCount(count + 1);
        return;
      }
      synth.triggerAttackRelease('C3', '10n');
      gameBlocks.current[keysPressed.current].innerText = e.key;
      gameBlocks.current[keysPressed.current].style.background = '#4caf50';
      //show next

      nextButtonRef.current.style.display = 'flex';
      return;
    }
    // if user key matches correct letter of sentence
    if (e.key === sentenceRef.current[keysPressed.current]) {
      synth.triggerAttackRelease('C3', '10n');
      runningScore = runningScore + 1;
      gameBlocks.current[keysPressed.current].style.background = '#4caf50';
    }
    //puts user key output into block
    if (gameBlocks.current[keysPressed.current]) {
      gameBlocks.current[keysPressed.current].innerText = e.key;
      keysPressed.current++;
    } else {
      //resets record of keys pressed on reload
      keysPressed.current = 0;
      return;
    }
  };

  let format;
  if (data) {
    format = formatter(data);
    sentenceRef.current = data.sentence;
    scrambledRef.current = scrambler(data.sentence);
  }

  const handleNext = () => {
    runningScore = 0;
    keysPressed.current = 0;
    gameBlocks.current = null;
    setCount(count + 1);
    nextButtonRef.current.style.display = 'none';
    synth.triggerAttackRelease('C6', '20n');
  };

  return count === 11 ? (
    <Winner />
  ) : (
    <>
      <div className='game_wrapper'>
        <div className='text_headings'>
          {loading ? 'Loading...' : error ? error.message : null}
          <h1 className={'scramble_header'}>{scrambledRef.current}</h1>
          <div ref={sentenceRef} style={{ display: 'none' }}>
            {data && data.sentence}
          </div>
          <h2>Guess the sentence! Starting typing</h2>
          <h2>the yellow blocks are meant for spaces</h2>
          <h1 ref={scoreRef}>Score: {count - 1}</h1>
        </div>
        <div className='block_wrapper'>
          {format &&
            format.map((word, i) => (
              <div key={uuid()} style={styler}>
                <Rows
                  key={gameBlocks}
                  word={word}
                  forwardedRef={gameBlocks}
                  num={i}
                  keysPressed={keysPressed}
                />
              </div>
            ))}
        </div>{' '}
      </div>
      {count < 9 && (
        <div
          ref={nextButtonRef}
          className={'next_button_div'}
          style={{ justifyContent: 'center', display: 'none' }}
        >
          <button className='next_button' onClick={handleNext}>
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default App;
