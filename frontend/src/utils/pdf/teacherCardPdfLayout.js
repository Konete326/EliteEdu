export const A4_WIDTH = 595.28;
export const A4_HEIGHT = 841.89;
export const CARD_WIDTH = 260;
export const CARD_HEIGHT = 165;
export const LEFT_MARGIN = 25;
export const COL_GAP = 25;
export const TOP_OFFSET = 40;
export const ROW_GAP = 25;

export const VERT_CARD_WIDTH = 172;
export const VERT_CARD_HEIGHT = 275;
export const VERT_GAP = 20;

export const getCardCoordinates = (indexOnPage, orientation = 'horizontal') => {
  if (orientation === 'vertical') {
    const col = indexOnPage % 3;
    const totalWidth = 3 * VERT_CARD_WIDTH + 2 * VERT_GAP;
    const leftMargin = (A4_WIDTH - totalWidth) / 2;
    const x = leftMargin + col * (VERT_CARD_WIDTH + VERT_GAP);
    const y = (A4_HEIGHT - VERT_CARD_HEIGHT) / 2;
    return { x, y, width: VERT_CARD_WIDTH, height: VERT_CARD_HEIGHT };
  }

  const col = indexOnPage % 2;
  const row = Math.floor(indexOnPage / 2);
  const x = LEFT_MARGIN + col * (CARD_WIDTH + COL_GAP);
  const y = A4_HEIGHT - TOP_OFFSET - CARD_HEIGHT - row * (CARD_HEIGHT + ROW_GAP);
  return { x, y, width: CARD_WIDTH, height: CARD_HEIGHT };
};

export const getMirroredBackCoordinates = (indexOnPage, orientation = 'horizontal') => {
  if (orientation === 'vertical') {
    const col = 2 - (indexOnPage % 3);
    const totalWidth = 3 * VERT_CARD_WIDTH + 2 * VERT_GAP;
    const leftMargin = (A4_WIDTH - totalWidth) / 2;
    const x = leftMargin + col * (VERT_CARD_WIDTH + VERT_GAP);
    const y = (A4_HEIGHT - VERT_CARD_HEIGHT) / 2;
    return { x, y, width: VERT_CARD_WIDTH, height: VERT_CARD_HEIGHT };
  }

  const col = 1 - (indexOnPage % 2);
  const row = Math.floor(indexOnPage / 2);
  const x = LEFT_MARGIN + col * (CARD_WIDTH + COL_GAP);
  const y = A4_HEIGHT - TOP_OFFSET - CARD_HEIGHT - row * (CARD_HEIGHT + ROW_GAP);
  return { x, y, width: CARD_WIDTH, height: CARD_HEIGHT };
};

export const chunkArray = (array, chunkSize = 8) => {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
};
