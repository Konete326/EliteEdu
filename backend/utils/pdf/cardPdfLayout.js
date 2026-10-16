const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const CARD_WIDTH = 260;
const CARD_HEIGHT = 165;
const LEFT_MARGIN = 25;
const COL_GAP = 25;
const TOP_OFFSET = 40;
const ROW_GAP = 25;

const getCardCoordinates = (indexOnPage) => {
  const col = indexOnPage % 2;
  const row = Math.floor(indexOnPage / 2);
  const x = LEFT_MARGIN + col * (CARD_WIDTH + COL_GAP);
  const y = A4_HEIGHT - TOP_OFFSET - CARD_HEIGHT - row * (CARD_HEIGHT + ROW_GAP);
  return { x, y, width: CARD_WIDTH, height: CARD_HEIGHT };
};

const getMirroredBackCoordinates = (indexOnPage) => {
  const col = 1 - (indexOnPage % 2);
  const row = Math.floor(indexOnPage / 2);
  const x = LEFT_MARGIN + col * (CARD_WIDTH + COL_GAP);
  const y = A4_HEIGHT - TOP_OFFSET - CARD_HEIGHT - row * (CARD_HEIGHT + ROW_GAP);
  return { x, y, width: CARD_WIDTH, height: CARD_HEIGHT };
};

const chunkArray = (array, chunkSize = 8) => {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
};

module.exports = {
  A4_WIDTH,
  A4_HEIGHT,
  CARD_WIDTH,
  CARD_HEIGHT,
  getCardCoordinates,
  getMirroredBackCoordinates,
  chunkArray
};
