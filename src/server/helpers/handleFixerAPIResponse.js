exports.default = function (error, response, body, searchVal1, searchVal2) {
  const data = JSON.parse(body)
  console.log('(*) data.success =>', data.success)
  console.log('(*) response =>', response.statusCode)

  if (response.statusCode !== 200) {

    return({
      status: 'fail',
      message: 'Service Error! Please contact tech support (Fixer API did not return 200)'
    })

  // Requests receives data from API --
  } else if (data.success) {
    const rates = data.rates
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

  } else if (data.error && data.error.code === 202) {
    return({
      // --> Fixer-side message for no match of searched values
      status: 'fail',
      message: `You requested ${searchBox1} and ${searchBox2}. Please check that these are valid currencies, and try again.`
    })

  } else if (data.error) {
    return({
      // --> Miscellaneous Fixer-side error
      status: 'fail',
      message: `Service Error! Please contact tech support
      (Fixer API Error ${data.error.code}: ${data.error.message})`
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