import React from 'react'

const SearchDisplay = ({ searchShow, handleCreateRecord, newRecordFormMessage, newRecordForm, setNewRecordForm }) => {

  const searchStatus = (searchShow && searchShow.status) ? searchShow.status : null
  
  if (searchStatus === 'success') {
    const { searchVal1, searchVal2, displayRate } = searchShow
    return(
      <div>
        <h3>
          The rate for {searchVal1}-{searchVal2} is {displayRate}.
        </h3>
        <div>
          <p>Upper Limit</p>
          <input
            value={newRecordForm.upperVal}
            onChange={(e) => setNewRecordForm('upperVal', e.target.value)}
            type='number'
            step='0.000001'
          />
          <p>Lower Limit</p>
          <input
            value={newRecordForm.lowerVal}
            onChange={(e) => setNewRecordForm('lowerVal', e.target.value)}
            type='number'
            step='0.000001'
          />
        </div>
        <button onClick={handleCreateRecord}>
          Track This Rate
        </button>
        <p><small>{newRecordFormMessage}</small></p>
      </div>
    )
  } else if (searchStatus === 'fail') {
    return(
      <code>
        { searchShow.message ?
          searchShow.message
          :
          'Failed to search for the rate specified.'
        }
      </code>
    )
  } else {
    return(
      <p>
        
      </p>
    )
  }
}

export default SearchDisplay