import { client } from '../../services/';
import { ValidationType } from '../../types/listTypes';

export default class ValidationClient {
  
  async validateDocument(documentId, 
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

  async isCheckSumValid(documentId) {
	  return await this.isMethodValid(documentId, 'validateChecksum', 'checksum');
  }
 
  async isSchemaValid(documentId) {
	  return await this.isMethodValid(documentId, 'validateSchema', 'schema');
  }
  
  async isSignatureValid(documentId) {
     return await this.isMethodValid(documentId, 'validateSignature', 'signature');
  }
  
  async isMethodValid(documentId, postMethod, typeMethod) {
	return await client.post(`documents/${documentId}/${postMethod}`)
      .then((response) => {
         return response.data && response.data.valid;
      })
      .catch((error) => {
		 console.warn(`${typeMethod} error  ${error}`);
         return error;
      });
  }

}