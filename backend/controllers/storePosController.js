const { getItems, createItem, updateItem, deleteItem } = require('./storeItemController');
const { getSales, createSale } = require('./storeSaleController');

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getSales,
  createSale
};
