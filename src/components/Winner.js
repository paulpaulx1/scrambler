import React from 'react';

export const Winner = () => {
  return (
    <div onClick={() => window.location.reload()} className='winner'>
      <div>You Win!</div>
    </div>
  );
};
