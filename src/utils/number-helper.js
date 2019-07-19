
// Number, convert, format, parse utility helper 

export default class NumberHelper {

   static convertToSize(bytes) {
      if(bytes < 1024) return bytes + ' bytes';
      else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + ' kb';
      else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + ' mb';
      else return(bytes / 1073741824).toFixed(3) + ' gb';
   }
   
}