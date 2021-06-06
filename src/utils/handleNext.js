export const handleNext = (
  runningScore,
  numKeysPressed,
  gameBlocks,
  count,
  setCount,
  nextButtonRef
) => {
  runningScore = 0;
  numKeysPressed.current = 0;
  gameBlocks.current = null;
  setCount(count + 1);
  nextButtonRef.current.style.display = 'none';
};
