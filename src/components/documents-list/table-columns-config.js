import React, { Component } from 'react';

import { textFilter } from 'react-bootstrap-table2-filter';
import DateHelper from '../../utils/date-helper';
import NumberHelper from '../../utils/number-helper';


export default class DocumentTableColumnsConfig extends Component { 
 
   getColumns( 
	 parentContext,
     parentState,
	 isMobileView = false,
	 isValidationListActive = false,
	 toggleOnOffValidateHistoryCallback, 
	 displayValidationCallback) {
	   const formatProcessed = (cell, row) => {
		 return(
			<div>
			 {toggleOnOffValidateHistoryCallback(row, true, parentContext)}
			</div>
		 )
	   };
	   
	   const formatValidateHistory = (cell, row) => {
		 return(
			<div>
			 {toggleOnOffValidateHistoryCallback(row, false, parentContext)}
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
			<span>{displayValidationCallback(row, parentState)}</span>
		 )
	   };
	   
	   const formatCreationDate = (cell, row) => {
		 return(
			<span>{DateHelper.parseReleaseDate(cell)}</span>
		 )
	   };
	   
	   let valHistoryColumnIndex = 5;
	   
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
	   
	   if (isMobileView) {
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
	   
	   if (isValidationListActive) {
		   columns[valHistoryColumnIndex] = { 
			  dataField: 'custom_processed',
			  text: 'Remove',
			  formatter: formatValidateHistory
          };
	   }
	   
	   return columns;
   }
	   
}
