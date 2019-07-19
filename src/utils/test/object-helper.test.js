
// Array / Object utility helper

import ObjectHelper from '../object-helper';

it('should say item exists with data', () => {
  const array = [ { id: 15781400, poster: 'yo' }, { id: 545645448, poster: 'yes' } ];
  const res = { exists: true, index: 0 };
  expect(ObjectHelper.checkIfItemExistsInArray(array, 15781400)).toEqual(res);
});

it('should say item not exists', () => {
  const array = [ { id: 15781400, poster: 'yo' }, { id: 545645448, poster: 'yes' } ];
  const res = { exists: false, index: -1 };
  expect(ObjectHelper.checkIfItemExistsInArray(array, 215000)).toEqual(res);
});