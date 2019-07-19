import axios from "axios";

export default class ValidationClient {
  client;

  constructor() {
      this.client = axios.create({
          baseURL: "http://fe-test.guardtime.com/",
          headers: {
              "Content-Type": "application/json"
          }
      });
  }

  async isCheckSumValid(documentId = 0) {
     return await this.client.post('documents/'+documentId+'/validateChecksum')
      .then((response) => {
		 let isValid = response.data && response.data.valid;
         return isValid;
      })
      .catch((error) => {
         console.warn('checksum error ', error);
         return error;
      });
  }
  
   async isSchemaValid(documentId = 0) {
     return await this.client.post('documents/'+documentId+'/validateSchema')
      .then((response) => {
		 let isValid = response.data && response.data.valid;
         return isValid;
      })
      .catch((error) => {
         console.warn('schema error ', error);
         return error;
      });
  }
  
   async isSignatureValid(documentId = 0) {
     return await this.client.post('documents/'+documentId+'/validateSignature')
      .then((response) => {
		 let isValid = response.data && response.data.valid;
         return isValid;
      })
      .catch((error) => {
         console.warn('signature error ', error);
         return error;
      });
  }

}