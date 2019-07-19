import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDocuments } from '../../actions/document-actions';
import { FetchListType } from '../../types/listTypes';
import '../../components/documents-list/documents-list.scss';

const TOTAL_PAGES_DEFAULT = 5;

class ServerPagination extends Component {

	state = {
		pageNumber: 1,
		activePageNumber: 1,
	}

	onServerPageToggle(e, direction) {
        e.preventDefault();
        const itemsCount = this.getTotalPagesCount();
        let curPageNumber = this.state.pageNumber;
        let newPageNumber;
        if (direction === 'prev') {
            newPageNumber = curPageNumber > 1 ? curPageNumber - 1 : curPageNumber;
        } else {
            newPageNumber = curPageNumber < itemsCount ? curPageNumber + 1 : curPageNumber;
        }
        this.onServerPageNumberClick(e, newPageNumber);
    }

    showServerPrevPage() {
       return (
            <div key='prev' className="server-nav-item"
                 onClick={(e) => this.onServerPageToggle(e, 'prev')}>Prev</div>
       );
    }

    showServerNextPage() {
        return (
            <div key='nex' className="server-nav-item"
                 onClick={(e) => this.onServerPageToggle(e, 'next')}>Next</div>
        );
    }

   onServerPageNumberClick(e, pageNumber) {
        e.preventDefault();
        this.setState({
            pageNumber: pageNumber,
            activePageNumber: pageNumber
        })
		this.fetchAndUpdate(pageNumber);
        return false;
   }
   
   fetchAndUpdate(pageNumber) {
	  const list = this.props.listType;
	  const perPage = this.props.perPage;
	  switch(list) {
		  case FetchListType.DOCUMENTS:
		  default:
		     this.props.fetchDocuments(pageNumber, perPage);
		  break;
	  }
   }
   
   getTotalPagesCount() {
	   const totalPage = this.props.totalPages ? this.props.totalPages : TOTAL_PAGES_DEFAULT;
	   return totalPage;
   }

   render(){      
		if (!this.props.show) {
			return <div></div>;
		}
        const size = this.getTotalPagesCount();
        let list = []
        let children = [];

		children.push(this.showServerNextPage());
        children.push(this.showServerPrevPage());
		  
        for (let i = 1; i <= size; i++) {
            let className = i === this.state.activePageNumber ?
                'server-pagination-item-active' : 'server-pagination-item';
            children.push(
                <li key={`page-${i}`} className={className}
                    onClick={(e) => this.onServerPageNumberClick(e, i)}>
                       {`${i}`}</li>)
        }
     
        list.push(<ul key="page-navigation" className="server-pagination">{children}</ul>)
		if (this.state.validateLater) {
			return <div></div>;
		}
        return list;
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

export default connect(mapStateToProps, {fetchDocuments})(ServerPagination);