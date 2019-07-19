import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentsError from '../components/documents-error/documents-error';
import { fetchDocuments } from '../actions/document-actions';

import { Button } from 'react-bootstrap';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/documents-list/documents-list.scss';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import SweetAlert from 'react-bootstrap-sweetalert';

import DateHelper from '../utils/date-helper';
import ObjectHelper from '../utils/object-helper';
import NumberHelper from '../utils/number-helper';

import ValidationClient from '../validate';

import { FetchListType, ListType, ValidationType, ListOperations } from '../types/listTypes';
import { MOBILE_SCREEN_WIDTH } from '../types/mobileVars';
import ServerPagination from '../components/server-pagination/server-pagination';
import { FaStar, FaTrashAlt } from 'react-icons/fa';

const TOTAL_LIST_PAGES = 10;
const PER_PAGE = 10;
const FILE_QUEUE_TIMEOUT = 2000;

class DocumentsListPage extends Component {
	
  validationClient;

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
  }
  
  constructor(props) {
	  super(props);
	  this.validationClient = new ValidationClient();
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
	 const total = documentIds.length;
	 this.startFileQueue(documentIds, 0, total);
  }
  
  startFileQueue(files, counter = 0, total = 0) {
	if(counter < total){
		this.setState({ currentFileValidation: { id: 100, statusName: 'All files starting to process... ' }});
		setTimeout(() => {
		  this.validateDocument(files[counter], false);
		  this.setState({ validateAllSummary: { index: counter, total: total }});
		  counter++;
		  this.startFileQueue(files, counter, total);
		}, FILE_QUEUE_TIMEOUT);
	  } else {
		  this.setState({validateAllStarted: false});
		  this.refreshTable();
		  setTimeout(() => { this.setState({ validateAllSummary: { index: 0, total: 0 }}) }, 500);
	  }
   }
  
 
  
  async validateDocument(documentId = 0, isRefreshTable = true) {
	 let isCheckSumValid, isSchemaValid, isSignatureValid;
	 this.setState({ showProcessAlert: true });
	 
	 this.setValidationStatus(documentId, ValidationType.CHECKSUM + ' processing...');
	 isCheckSumValid = await this.validationClient.isCheckSumValid(documentId);
	 this.setValidationStatus(documentId, ValidationType.CHECKSUM, isCheckSumValid, true, isRefreshTable); 
	 if (!isCheckSumValid) { return false; }
	 
	 this.setValidationStatus(documentId, ValidationType.SCHEMA + ' processing...'); 
	 isSchemaValid = await this.validationClient.isSchemaValid(documentId);
	 this.setValidationStatus(documentId, ValidationType.SCHEMA, isSchemaValid, true, isRefreshTable); 
	 if (!isSchemaValid) { return false; }

	 this.setValidationStatus(documentId, ValidationType.SIGNATURE + ' processing...'); 
	 isSignatureValid = await this.validationClient.isSignatureValid(documentId);
	 this.setValidationStatus(documentId, ValidationType.SIGNATURE, isSignatureValid, true, isRefreshTable); 
	 if (!isSignatureValid) {  return false; }

	 this.setValidationStatus(documentId, '', true, true, isRefreshTable);
	 setTimeout(() => { this.setState({ showProcessAlert: true }) }, 700);
  }
  
  setValidationStatus(documentId = 0, 
	  statusName = '',
	  processValid = false, 
	  isLastStage = false, 
	  isRefreshTable = true) {
	let updValidatedFiles = this.state.validatedFiles;
	this.setState({ 
	  	currentFileValidation: { id: documentId, statusName: statusName + ' is ' , valid: processValid ? 'valid' : 'invalid', completed: isLastStage }
	});
    if (isLastStage) {
	   const newFileValidation = { id: documentId, statusName: statusName, valid: processValid ? 'valid' : 'invalid' };
	   updValidatedFiles.push(newFileValidation);
	   this.setState({ validatedFiles: updValidatedFiles });  
	   if (isRefreshTable) {
		   setImmediate(() => { this.refreshTable(); });
	   } 
    }
  }
  
  displayValidationStatus(row) {
	  for (let validation of this.state.validatedFiles) {
		  if (row.id === validation.id) {
			  return validation.valid;
		  }
	  }
  }
  
  displayCurrentFileValidationStatus() {
	  if (this.state.currentFileValidation.id !== 0) {
		  return this.showProcessMessage();
	  } else return <div> </div>
  }
  
  alertCurrentFileValidation() {
	 const html = this.showProcessMessage(true);
	 if (this.state.showProcessAlert) {
		 return <SweetAlert success title="Processing file..." allowEscape={true} 
			onConfirm={()=> { this.setState({ showProcessAlert: false})}}>
		     {html}
	      </SweetAlert> 
	 } else {
		 return <div> </div>
	 }
  }
  
  showProcessMessage(useBreakLine = false) {
	  const br = useBreakLine ? <br /> : <span></span>;
	  let allFileSummary = <span> </span>;
	  if (this.state.validateAllSummary.total > 0) {
		  allFileSummary = <span> File # {this.state.validateAllSummary.index + 1} / {this.state.validateAllSummary.total} </span> 
	  }
	  return <span className='status-messanger'> { 'File: ' + this.state.currentFileValidation.id }  
		  {br} {allFileSummary} <b> { this.state.currentFileValidation.statusName } </b>  
			 <span className={'status-color-'+this.state.currentFileValidation.valid}> {
				 this.state.currentFileValidation.valid } </span> </span>;
  }
  
  displayValidateAllButton() {
	  return <Button variant="primary" className='common-button' value="validate-all"
                    onClick={(e) => { this.validateAll(); 
					}}>Validate All</Button>
  }
  
  
  onAddValidateHistory(e, row) {
	e.preventDefault();
    this.validateDocument(row.id);
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
  
  toggleOnOffValidateHistory(row, isAdd) {
    if (isAdd) {
	   return (<Button variant="outline-info" value="addWatchHistory"
			onClick={(e) => { this.onAddValidateHistory(e, row) }}>Validate Now</Button>);
    } 
	return (<Button variant="outline-info" value="removeWatchHistory"
		onClick={(e) => { this.onRemoveValidateHistory(e, row) }}>
			<FaTrashAlt />
		</Button>);
  }
  

   showTable() {
	  const documents = this.state.validateHistory ? this.state.validateHistoryList : this.props.documents;
	   
	  const formatProcessed = (cell, row) => {
		 return(
			<div>
			 {this.toggleOnOffValidateHistory(row, true)}
			</div>
		 )
	   };
	   
	   const formatValidateHistory = (cell, row) => {
		 return(
			<div>
			 {this.toggleOnOffValidateHistory(row, false)}
			</div>
		 )
	   };
	   
	   const formatSize = (cell, row) => {
		 return(
			<span>{NumberHelper.convertToSize(cell)}</span>
		 )
	   };
	   
	   const formatStatus = (cell, row) => {
		 return(
			<span>{this.displayValidationStatus(row)}</span>
		 )
	   };
	   
	   const formatCreationDate = (cell, row) => {
		 return(
			<span>{DateHelper.parseReleaseDate(cell)}</span>
		 )
	   };

       let columns = [{
           dataField: 'id',
           text: 'ID'
       }, {
           dataField: 'filename',
           text: 'File',
           filter: textFilter(),
           sort: true,
       }, {
           dataField: 'size',
           text: 'Size',
           sort: true
       }, {
           dataField: 'author',
           text: 'Author',
		   sort: true
       }, { // custom column to add to processed
           dataField: 'custom_processed',
           text: 'Process',
		   formatter: formatProcessed
       }, { 
           dataField: 'custom_status',
           text: 'Status',
		   formatter: formatStatus
       },	{
           dataField: 'created_at',
           text: 'Creation date',
		   formatter: formatCreationDate,
		   sort: true
       }];
	   
	   let valHistoryColumnIndex = 5;
	   
	   // add less columns for mobile version
	   if (this.state.screenWidth < MOBILE_SCREEN_WIDTH) {
		   columns = [{
			   dataField: 'filename',
			   text: 'File',
			   sort: true,
		   },{
			   dataField: 'size',
			   text: 'Size',
			   sort: true,
		   }, {
			   dataField: 'author',
			   text: 'Author',
			   sort: false
		   }, {
			   dataField: 'custom_processed',
			   text: 'Process',
			   formatter: formatProcessed
		   }, {
			   dataField: 'custom_status',
			   text: 'Status',
			   //formatter: formatStatus
		   } ];
		   valHistoryColumnIndex = 3;
	   }
	   
	   if (this.state.validateHistory) {
		   columns[valHistoryColumnIndex] = { 
			  dataField: 'custom_processed',
			  text: 'Remove',
			  formatter: formatValidateHistory
          };
	   }
	   	   
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

// Make contacts  array available in  props
function mapStateToProps(state) {
  return {
      documents: state.documentsStore.documents,
      loading: state.documentsStore.loading,
      errors: state.documentsStore.errors
  }
}

export default connect(mapStateToProps, {fetchDocuments})(DocumentsListPage);
