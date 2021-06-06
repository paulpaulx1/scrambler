import { useState, useEffect, useRef } from 'react';
import { scrambler, fetchData, formatter } from './utils';
import { Winner, Grid, Next } from './components';
import { winSound, correctSound, wrongSound, nextSound } from './utils/sound';

function App() {
  const [level, setlevel] = useState(1);
  const [retry, setRetry] = useState(false);
  const [state, setState] = useState({
    loading: false,
    error: null,
    sentence: [],
  });

  const levelBlocksCorrect = useRef(0);
  const numKeysPressed = useRef(0);
  const gameBlocks = useRef(null);
  const correctSentenceRef = useRef(null);
  const scrambledRef = useRef(null);
  const scoreRef = useRef(null);
  const nextButtonRef = useRef(null);

  let { current: currentBlocksCorrect } = levelBlocksCorrect;

  useEffect(() => {
    async function setData() {
      try {
        setState({ loading: true, sentence: '', error: null, level: level });
        const { data } = await fetchData(level);
        setState({
          loading: false,
          sentence: data,
          error: null,
        });
      } catch (err) {
        setState({ loading: false, sentence: [], error: err, level: level });
      }
    }
    if (level < 11) {
      setData();
    }
    window.addEventListener('keypress', onKey);
    return function cleanup() {
      gameBlocks.current = [];
      window.removeEventListener('keypress', onKey);
    };
  }, [level, retry]);

  const { loading, error, sentence } = state;
  const { data } = sentence;

  const onKey = (e) => {
    let numberOfAllBlocks = gameBlocks.current.length - 1;
    let levelBlocks = gameBlocks.current;
    const correctSentence = correctSentenceRef.current;
    let currentNumKeysPressed = numKeysPressed.current;
    numKeysPressed.current = numKeysPressed.current + 1;

    //when all the blocks have letters
    if (currentNumKeysPressed > numberOfAllBlocks) {
      //restart level if user didn't get all the letters correct
      console.log(currentBlocksCorrect, numberOfAllBlocks);
      if (currentBlocksCorrect < numberOfAllBlocks + 1) {
        numKeysPressed.current = 0;
        alert('Try this level again :0');
        setRetry(!retry);
      }
      return;
    }

    //user got all the of letters correct
    //level is complete, show next button
    if (
      currentBlocksCorrect === numberOfAllBlocks &&
      e.key === correctSentence[currentNumKeysPressed]
    ) {
      //user got every level correct and wins the game
      if (level === 10) {
        winSound();
        setlevel(level + 1);
        return;
      }

      correctSound();
      levelBlocks[currentNumKeysPressed].innerText = e.key;
      levelBlocks[currentNumKeysPressed].style.background = '#4caf50';

      //show next button when level is completely correct
      nextButtonRef.current.style.display = 'flex';
      numKeysPressed.current = numKeysPressed.current + 1;
      return;
    }

    // if user key matches correct letter of sentence
    if (e.key === correctSentence[currentNumKeysPressed]) {
      correctSound();
      currentBlocksCorrect = currentBlocksCorrect + 1;
      levelBlocks[currentNumKeysPressed].style.background = '#4caf50';
    }

    //puts key into corresponding block
    if (levelBlocks[currentNumKeysPressed]) {
      if (e.key !== correctSentence[currentNumKeysPressed]) {
        wrongSound();
      }
      levelBlocks[currentNumKeysPressed].innerText = e.key;
      // numKeysPressed.current++;
    } else {
      //rerenders, reset number of keys pressed
      numKeysPressed.current = 0;
      return;
    }
  };

  let format;
  //splits sentence up into mappable format
  if (data) {
    format = formatter(data);
    correctSentenceRef.current = data.sentence;
    scrambledRef.current = scrambler(data.sentence);
  }

  //re-render and reset when you click the 'next' button
  const handleNext = () => {
    currentBlocksCorrect = 0;
    numKeysPressed.current = 0;
    gameBlocks.current = null;
    setlevel(level + 1);
    nextButtonRef.current.style.display = 'none';
    nextSound();
  };

  return level === 11 ? (
    <Winner />
  ) : (
    <>
      {loading ? 'Loading...' : error ? error.message : null}
      <div className='game_wrapper'>
        <div className='text_headings'>
          <h1 className={'scramble_header'}>{scrambledRef.current}</h1>
          <h2>Guess the sentence! Starting typing</h2>
          <h2>the yellow blocks are meant for spaces</h2>
          <h1 ref={scoreRef}>Score: {level - 1}</h1>
        </div>
        <div className='grid_wrapper'>
          {format && <Grid format={format} forwardedRef={gameBlocks} />}
        </div>
      </div>
      {level < 10 && (
        <Next forwardedRef={nextButtonRef} handleNext={handleNext} />
      )}
    </>
  );
}

export default App;
