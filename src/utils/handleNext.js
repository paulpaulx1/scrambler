export const handleNext = (
  runningScore,
  keysPressed,
  gameBlocks,
  count,
  setCount,
  nextButtonRef
) => {
  runningScore = 0;
  keysPressed.current = 0;
  gameBlocks.current = null;
  setCount(count + 1);
  nextButtonRef.current.style.display = 'none';
};
