import axios from "axios";
import { ValidationType } from '../../types/listTypes';

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
  
  async validateDocument(documentId = 0, 
    parentContext,
	isRefreshTable = true,
	setValidationStatusCb,
	setProcessAlertCb) {
	 let isCheckSumValid, isSchemaValid, isSignatureValid;
	 setProcessAlertCb(parentContext);
	 
	 setValidationStatusCb(documentId, parentContext, ValidationType.CHECKSUM + ' processing...');
	 isCheckSumValid = await this.isCheckSumValid(documentId);
	 setValidationStatusCb(documentId, parentContext, ValidationType.CHECKSUM, isCheckSumValid, true, isRefreshTable); 
	 if (!isCheckSumValid) { return false; }
	 
	 setValidationStatusCb(documentId, parentContext, ValidationType.SCHEMA + ' processing...'); 
	 isSchemaValid = await this.isSchemaValid(documentId);
	 setValidationStatusCb(documentId, parentContext, ValidationType.SCHEMA, isSchemaValid, true, isRefreshTable); 
	 if (!isSchemaValid) { return false; }

	 setValidationStatusCb(documentId, parentContext, ValidationType.SIGNATURE + ' processing...'); 
	 isSignatureValid = await this.isSignatureValid(documentId);
	 setValidationStatusCb(documentId, parentContext, ValidationType.SIGNATURE, isSignatureValid, true, isRefreshTable); 
	 if (!isSignatureValid) {  return false; }

	 setValidationStatusCb(documentId, parentContext, '', true, true, isRefreshTable);
	 setTimeout(() => { setProcessAlertCb(parentContext); }, 700);
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