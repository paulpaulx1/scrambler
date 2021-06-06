import React from 'react';

export const Next = ({ forwardedRef, handleNext }) => {
  return (
    <div
      ref={forwardedRef}
      className={'next_button_div'}
      style={{ justifyContent: 'center', display: 'none' }}
    >
      <button className='next_button' onClick={handleNext}>
        Next
      </button>
    </div>
  );
};
