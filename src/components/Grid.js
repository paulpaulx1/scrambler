import uuid from 'react-uuid';
import { Row } from './Row';
import { row_wrap_styles } from '../utils/blockHolder';

export const Grid = ({ format, gameBlocks, forwardedRef }) => {
  return format.map((word, i) => (
    <div key={uuid()} style={row_wrap_styles}>
      <Row word={word} forwardedRef={forwardedRef} num={i} />
    </div>
  ));
};
