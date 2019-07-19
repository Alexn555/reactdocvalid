
// Date format, parse utility helper 

export default class DateHelper {

   static parseReleaseDate(rowDate = '') {
	  if (rowDate === '') { return ''; }
	  const parts = rowDate.split('-');
	  let dayTime = parts[2].split('T');
	  const day = dayTime[0];
	  let time = dayTime[1]; 
	  time = time.split('Z')[0];
	  return day + '.' + parts[1]+'.'+parts[0];
  }
  

}