import React from 'react'

const SearchDisplay = ({ searchShow, handleCreateRecord, newRecordFormMessage, newRecordForm, setNewRecordForm }) => {

  const searchStatus = (searchShow && searchShow.status) ? searchShow.status : null
  
  if (searchStatus === 'success') {
    const { searchVal1, searchVal2, displayRate } = searchShow
    return(
      <div className="section">
        <h3 className="subtitle is-4">
          The rate for {searchVal1}-{searchVal2} is <b>{displayRate}</b>.
        </h3>
        <div className="field">
          <label className="label">Set Upper Limit</label>
          <div className="control">
            <input
              className="input"
              value={newRecordForm.upperVal}
              onChange={(e) => setNewRecordForm('upperVal', e.target.value)}
              type='number'
              step='0.000001'
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Set Lower Limit</label>
          <div className="control">
            <input
              className="input"
              value={newRecordForm.lowerVal}
              onChange={(e) => setNewRecordForm('lowerVal', e.target.value)}
              type='number'
              step='0.000001'
            />
          </div>
        </div>
        <button className="button is-primary" onClick={handleCreateRecord}>
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