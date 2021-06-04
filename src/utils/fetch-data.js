import axios from 'axios';

export const fetchData = async (count) => {
  const x = await axios.get(
    `https://api.hatchways.io/assessment/sentences/${count}`
  );
  return x;
};
