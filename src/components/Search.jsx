import React, { useContext, useEffect, useState } from 'react';

import camelCase from 'lodash/camelCase';
import { useDispatch, useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Icon, SearchField, messages } from '@edx/paragon';
import { Search as SearchIcon } from '@edx/paragon/icons';

import { DiscussionContext } from '../discussions/common/context';
import { setUsernameSearch } from '../discussions/learners/data';
import { setSearchQuery } from '../discussions/posts/data';
import postsMessages from '../discussions/posts/post-actions-bar/messages';
import { setFilter as setTopicFilter } from '../discussions/topics/data/slices';
import './search.scss'
import iconClose from '../assets/close.svg'
import iconSearch from '../assets/fe_search.svg'

function Search({ intl, close }) {
  const [previousSearchValue, setPreviousSearchValue] = useState('');
  const dispatch = useDispatch();
  const { page } = useContext(DiscussionContext);
  const postSearch = useSelector(({ threads }) => threads.filters.search);
  const topicSearch = useSelector(({ topics }) => topics.filter);
  const learnerSearch = useSelector(({ learners }) => learners.usernameSearch);
  const isPostSearch = ['posts', 'my-posts'].includes(page);
  const isTopicSearch = 'topics'.includes(page);
  let searchValue = '';
  let currentValue = '';
  if (isPostSearch) {
    currentValue = postSearch;
  } else if (isTopicSearch) {
    currentValue = topicSearch;
  } else {
    currentValue = learnerSearch;
  }

  const onClear = () => {
    dispatch(setSearchQuery(''));
    dispatch(setTopicFilter(''));
    dispatch(setUsernameSearch(''));
    setPreviousSearchValue('');
  };

  const onChange = (query) => {
    searchValue = query;
  };

  const onSubmit = (query) => {
    if (query === '' || query === previousSearchValue) {
      return;
    }
    if (isPostSearch) {
      dispatch(setSearchQuery(query));
    } else if (page === 'topics') {
      dispatch(setTopicFilter(query));
    } else if (page === 'learners') {
      dispatch(setUsernameSearch(query));
    }
    setPreviousSearchValue(query);
  };

  const handlerCloseSearch = ()=>{
    close()
    if (currentValue){
      dispatch(setSearchQuery(''));
    dispatch(setTopicFilter(''));
    dispatch(setUsernameSearch(''));
    }
    
   

   
    
  }

  // useEffect(() => onClear(), [page]);
  return (
    <>
   
     <div className='row justify-content-center align-items-center'>
     <div className='col'>
     <SearchField.Advanced
        onClear={onClear}
        onChange={onChange}
        onSubmit={onSubmit}
        value={currentValue}
        className='search-field'
      >
        <span className="ml-2">
          <img src={iconSearch} alt='search' />
        </span>
        <SearchField.Label />
        <SearchField.Input
          style={{ paddingRight: '1rem' }}
          placeholder={intl.formatMessage(postsMessages.searchTitle)}
        />

      </SearchField.Advanced>
     </div>
     <div className='col-0.5'>
     <button className='btn' onClick={handlerCloseSearch}>
        <span> <img src={iconClose} alt='close' /> </span>
      </button>
     </div>
     </div>
    </>
  );
}

Search.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Search);
