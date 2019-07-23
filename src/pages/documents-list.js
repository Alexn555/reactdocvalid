import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentsError from '../components/documents-error/documents-error';
import { fetchDocuments } from '../actions/document-actions';

import { Button } from 'react-bootstrap';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/documents-list/documents-list.scss';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import SweetAlert from 'react-bootstrap-sweetalert';

import ObjectHelper from '../utils/object-helper';

import DocumentTableColumnsConfig from '../components/documents-list/table-columns-config';
import ValidationClient from '../services/validate';

import { FetchListType, ListType, ListOperations } from '../types/listTypes';
import { MOBILE_SCREEN_WIDTH } from '../types/mobileVars';
import ServerPagination from '../components/server-pagination/server-pagination';
import { FaTrashAlt } from 'react-icons/fa';

const TOTAL_LIST_PAGES = 10;
const PER_PAGE = 10;
const FILE_QUEUE_TIMEOUT = 2000;

class DocumentsListPage extends Component {
	
  validationClient;
  tableColumnsConfig;

  state = {
	  pageNumber: 1,
	  screenWidth: 0,
	  validateHistory: false,
	  validateHistoryList: [],
	  currentFileValidation: { id: null, statusName: '', valid: false, completed: false },
	  showProcessAlert: false,
	  showErrorAlert: true,
	  validateAllStarted: false,
	  validateAllSummary: { index: 0, total: 0},
	  validatedFiles: [],
  };
  
  constructor(props) {
	  super(props);
	  this.validationClient = new ValidationClient();
	  this.tableColumnsConfig = new DocumentTableColumnsConfig();
  }

  componentDidMount() {
     this.props.fetchDocuments(this.state.pageNumber, PER_PAGE);
	 this.updateWindowDimensions();
	 window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }
  
  updateWindowDimensions() {
	 this.setState({ screenWidth: window.innerWidth });
  }
  
  validateAll() {
	 this.setState({validateAllStarted: true});
	 // get all files (current page)
	 const documents = this.props.documents;
	 const documentIds = documents.map(item => item.id);
	 this.startFileQueue(documentIds, 0, documentIds.length);
  }
  
  startFileQueue(files, counter = 0, total = 0) {
	if(counter < total){
		this.setState({ currentFileValidation: { id: 100, statusName: 'All files starting to process... ' }});
		setTimeout(() => {
		  this.validationClient.validateDocument(files[counter], this, false, this.setValidationStatus, this.setProcessAlert);
		  this.setState({ validateAllSummary: { index: counter, total: total }});
		  counter++;
		  this.startFileQueue(files, counter, total);
		}, FILE_QUEUE_TIMEOUT);
	  } else {
		  this.setState({validateAllStarted: false}); 
		  this.refreshTable();
		  this.resetValidate();
	  }
   }
   
   resetValidate(timeout = 2000) {
	   setTimeout(() => { 
		 this.setState({ validateAllSummary: { index: 0, total: 0 }, validatedFiles: [] }) 
	   }, timeout);
   }
  
  setProcessAlert(self) {
	  self.setState({ showProcessAlert: true });
  }
  
  setValidationStatus(documentId, self,
	  statusName = '',
	  processValid = false, 
	  isLastStage = false, 
	  isRefreshTable = true) {
	let updValidatedFiles = self.state.validatedFiles;
	self.setState({ 
	  	currentFileValidation: { id: documentId, statusName: statusName + ' is ' , valid: processValid ? 'valid' : 'invalid', completed: isLastStage }
	});
    if (isLastStage) {
	   const newFileValidation = { id: documentId, statusName: statusName, valid: processValid ? 'valid' : 'invalid' };
	   updValidatedFiles.push(newFileValidation);
	   self.setState({ validatedFiles: updValidatedFiles });  
	   if (isRefreshTable) {
		   setImmediate(() => { self.refreshTable(); });
	   } 
    }
  }
  
  displayValidationStatus(row, state) {
	  for (let validation of state.validatedFiles) {
		  if (row.id === validation.id) {
			  return validation.valid;
		  }
	  }
  }
  
  displayCurrentFileValidationStatus() {
	  if (this.state.currentFileValidation.id !== 0) {
		  return this.getProcessMessage();
	  } else return <div> </div>
  }
  
  alertCurrentFileValidation() {
	 const html = this.getProcessMessage(true, true);
	 if (this.state.showProcessAlert) {
		 return <SweetAlert success title="Processing file..." allowEscape={true} 
			onConfirm={()=> { this.setState({ showProcessAlert: false})}}>
		     {html}
	      </SweetAlert> 
	 } else {
		 return <div> </div>
	 }
  }
  
  
  getProcessMessage(useBreakLine = false, isAlertDialog = false) {
	  const br = useBreakLine ? <br /> : <span></span>;
	  const validatedFiles = this.getValidatedFilesList();
	  let processedReport = <span> </span>;
	  let allFileSummary = <span> </span>;		
	  if (this.state.validateAllSummary.total > 0) {
		  if (isAlertDialog && this.state.validateAllSummary.index > 0){
			  processedReport = <div className='validatedFiles'> <br />
			    Report: {validatedFiles}  
			 </div>
		  }
		  
		  allFileSummary = <span> 
		      File # {this.state.validateAllSummary.index + 1} / {this.state.validateAllSummary.total}  <br />
		 </span> 
	  }
	  
	  return <span className='status-messanger'> { 'File: ' + this.state.currentFileValidation.id }  
		  {br} {allFileSummary} <b> { this.state.currentFileValidation.statusName } </b>  
			 <span className={'status-color-'+this.state.currentFileValidation.valid}> {
				 this.state.currentFileValidation.valid } </span> {processedReport} </span>;
  }
 
	 
  getValidatedFilesList() {
	 const arrayList = this.state.validatedFiles.map((file, index) => 
		<li key={index}>
			 <span className='validatedFileStrong'> {file.id} </span> | status: {file.statusName} is 
			 <span className={'validatedFileStrong status-color-'+file.valid}> {file.valid} </span>
		</li>
	 );
	 return <ul>{arrayList}</ul>;
  }
  
  displayValidateAllButton() {
	  return <Button variant="primary" className='common-button' value="validate-all"
                    onClick={(e) => { this.validateAll(); 
					}}>Validate All</Button>
  }
  
  
  onAddValidateHistory(e, row) {
	e.preventDefault();
    this.validationClient.validateDocument(row.id, this, true, this.setValidationStatus, this.setProcessAlert);
	this.addRemoveItem(this.state.validateHistoryList, ListType.VALIDATEHISTORY, row, ListOperations.ADD);
	return false;
  }
  
  onRemoveValidateHistory(e, row) {
	e.preventDefault();
	this.addRemoveItem(this.state.validateHistoryList, ListType.VALIDATEHISTORY, row, ListOperations.REMOVE);
	return false;
  }
  
  
  addRemoveItem(stateList, resList, row, actionType = ListOperations.ADD) {	  
	const curList = Object.assign([], stateList);
	const isItemInArray = ObjectHelper.checkIfItemExistsInArray(curList, row.id);
	 
	if (actionType === ListOperations.REMOVE && isItemInArray.exists) {
	    curList.splice(isItemInArray.index, 1);
	} 
	if (actionType === ListOperations.ADD && !isItemInArray.exists) {
		curList.push(row);
	}

	if (resList === ListType.VALIDATEHISTORY) {
		this.setState({validateHistoryList: curList});
	}
  }
  
  refreshTable() {
	  this.setState({ validateHistory: true });
	  setImmediate(() => { this.setState({ validateHistory: false }); });
  }
 
  filterSwitchValidateHistory() {
	 if (this.state.validateHistory) {
		 return (<Button variant="outline-info" value="full-list"
                    onClick={(e) => { this.setState({ validateHistory: false }); 
					}}>Full list</Button>);
	 } else {
		return (<Button variant="outline-info" value="watch-History"
                    onClick={(e) => { this.setState({ validateHistory: true });
					}}>Files History</Button>);
	 }
  }
  
  toggleOnOffValidateHistory(row, isAdd, self) {
    if (isAdd) {
	   return (<Button variant="outline-info" value="addWatchHistory"
			onClick={(e) => { self.onAddValidateHistory(e, row) }}>Validate Now</Button>);
    } 
	return (<Button variant="outline-info" value="removeWatchHistory"
		onClick={(e) => { self.onRemoveValidateHistory(e, row) }}>
			<FaTrashAlt />
		</Button>);
  }

   showTable() {
	   const documents = this.state.validateHistory ? this.state.validateHistoryList : this.props.documents;
	   const columns = this.tableColumnsConfig.getColumns(this,
			this.state,
			this.state.screenWidth < MOBILE_SCREEN_WIDTH,
			this.state.validateHistory,
			this.toggleOnOffValidateHistory,
			this.displayValidationStatus);
	   	   	   
       return (
           <div>
               <BootstrapTable keyField='id'
                               data={ documents }
                               columns={ columns }
                               headerClasses={'header-class'}
                               filter={ filterFactory() }
               />
           </div>
       ) 
   }

   render() {
      if (this.props.documents.length > 0 && this.props.errors.global === undefined ) {
          return (
              <div>
			    {this.filterSwitchValidateHistory()}
				{this.displayValidateAllButton()}
				{this.displayCurrentFileValidationStatus()}
				{this.alertCurrentFileValidation()}
                {this.showTable()}
				<ServerPagination 
				  show={!this.state.validateHistory && !this.state.validateAllStarted} 
				  fetchList={FetchListType.DOCUMENTS}
				  perPage={PER_PAGE}
				  totalPages={TOTAL_LIST_PAGES} />
              </div>
         );
      } 
      else {
         return (<div>
		   <DocumentsError object={this.props.documents}
                       loading={this.props.loading}
                       errors={this.props.errors}
              />
			  <ServerPagination 
				  show={!this.state.validateHistory && !this.state.validateAllStarted} 
				  fetchList={FetchListType.DOCUMENTS}
				  perPage={PER_PAGE}
				  totalPages={TOTAL_LIST_PAGES} />
		  </div>);
      }
   }

}

// Make items array available in  props
function mapStateToProps(state) {
  return {
      documents: state.documentsStore.documents,
      loading: state.documentsStore.loading,
      errors: state.documentsStore.errors
  }
}

export default connect(mapStateToProps, {fetchDocuments})(DocumentsListPage);
