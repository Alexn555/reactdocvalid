
// Array / Object utility helper

export default class ObjectHelper {
   
   static checkIfItemExistsInArray(array, checkId) {
	  if (array.length <= 0) { return false; }
	  let i = 0;
	  for (let item of array) {
		  if (item.id === checkId) {
			  return { exists: true, index: i};
		  }
		  i++;
	  }
	  return { exists: false, index: -1};
  }
 
 
}