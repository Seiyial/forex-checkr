import React from 'react'

const SearchDisplay = ({ searchShow, handleSaveItem }) => {
  const searchStatus = searchShow && searchShow.status ? searchShow.status : null
  if (searchStatus === 'success') {
    const { searchVal1, searchVal2, displayRate } = searchShow
    return(
      <div>
        <h3>
          The rate for {searchVal1}-{searchVal2} is {displayRate}.
        </h3>
        <button onClick={handleSaveItem}>
          Track This Rate
        </button>
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
        (search for a rate above)
      </p>
    )
  }
}

export default SearchDisplay