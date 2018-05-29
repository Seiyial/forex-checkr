exports.default = function (error, response, body, searchVal1, searchVal2) {
  console.log('body', body)

  if (response.status !== 200) {

    return({
      status: 'fail',
      message: 'Service Error! Please contact tech support (Fixer API did not return 200)'
    })

  // Requests receives data from API --
  } else if (body.success) {
    const rates = body.rates
    const hasRates = rates && rates[searchVal1] && rates[searchVal2]
    return(hasRates ?
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
        message: 'Service Error! Please contact tech support (Fixer API returned success without rate object)',
      }
    )

  } else if (body.error && body.error.code === 202) {
    return({
      // --> Fixer-side message for no match of searched values
      status: 'fail',
      message: `You requested ${searchBox1} and ${searchBox2}. Please check that these are valid currencies, and try again.`
    })

  } else if (body.error) {
    return({
      // --> Miscellaneous Fixer-side error
      status: 'fail',
      message: `Service Error! Please contact tech support
      (Fixer API Error ${body.error.code}: ${body.error.message})`
    })

  } else {
    return({
      // --> No error object returned from Fixer
      status: 'fail',
      message: `Service Error! Please contact tech support
      (Fixer API Error (null error object))`
    })
  }
}