exports.default = function (error, response, body, type = 'all', searchVal1 = null, searchVal2 = null) {
  const data = JSON.parse(body)

  if (response.statusCode !== 200) {

    return({
      status: 'fail',
      message: 'Service Error! Please contact tech support (Fixer API did not return 200)'
    })

  // Requests receives data from API --
  } else if (data.success) {
    return handleSuccessResponse(data, type, searchVal1, searchVal2)

  } else if (data.error && data.error.code === 202) {
    return({
      // --> Fixer-side message for no match of searched values
      status: 'fail',
      errorMessage: `You requested ${searchBox1} and ${searchBox2}. Please check that these are valid currencies, and try again.`
    })

  } else if (data.error) {
    return({
      // --> Miscellaneous Fixer-side error
      status: 'fail',
      errorMessage: `Service Error! Please contact tech support
      (Fixer API Error ${data.error.code}: ${data.error.message})`
    })

  } else {
    return({
      // --> No error object returned from Fixer
      status: 'fail',
      errorMessage: `Service Error! Please contact tech support
      (Fixer API Error (null error object))`
    })
  }
}

const handleSuccessResponse = (data, type, searchVal1, searchVal2) => {
  const rates = data.rates

  if (type === 'all') {
    // --> user is requesting for all exchange rates
    return {
      status: 'success',
      allRates: rates
    }

  } else {
    // --> user is not requesting for all, only one exchange rate
    const hasRatesForThisSearch = rates && rates[searchVal1] && rates[searchVal2]
    return(hasRatesForThisSearch ?
      // --> has match for searched values
      {
        status: 'success',
        searchVal1,
        searchVal2,
        displayRate: rates[searchVal1]
      }
    :
      // --> no match for searched Values
      {
        status: 'fail',
        errorMessage: 'Service Error! Please contact tech support (Fixer API returned success without rate object)',
      }
    )
  }
}