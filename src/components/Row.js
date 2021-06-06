import { styles } from '../utils/stylesblocks';
import uuid from 'react-uuid';

export const Row = ({ word, forwardedRef, num }) => {
  if (forwardedRef.current === null || !forwardedRef.length) {
    forwardedRef.current = [];
  }

  return word.map((letter) => (
    <div
      key={uuid()}
      ref={(el) =>
        forwardedRef.current.length
          ? forwardedRef.current.push(el)
          : (forwardedRef.current[num] = el)
      }
      style={letter === '?' ? styles.Active : styles.Inactive}
    >
      <div style={{ padding: 20 }}></div>
      <br />
    </div>
  ));
};
