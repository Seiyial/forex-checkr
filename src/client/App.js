import React from 'react'
import $ from 'jquery'
require('dotenv').config()

const formatForexCode = (input) => input.substring(0,3).toUpperCase()

export default class App extends React.Component {
  constructor() {
    super()
    // this.parseForexRate = this.parseForexRate.bind(this)
    this.state = {
      searchBox1: '',
      searchBox2: 'EUR',
      searchShow: { status: null }
    }
  }

  getForexRate({ code1, code2 }) {
    const searchVal1 = this.state.searchBox1
    const searchVal2 = this.state.searchBox2

    $.get(`http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY}`, '', (data, status, jqXHR) => {
    //   console.log("data", data, status)
    //   const updateSearch = (obj) => this.setState({ searchShow: obj })

    //   if (status !== 200) {
    //     updateSearch({
    //       status: 'fail',
    //       message: 'Service Error! Please contact tech support (Fixer API did not return 200)'
    //     })

    //   } else if (data.success) {
    //     const rates = data.rates
    //     const hasRates = rates && rates[searchVal1] && rates[searchVal2]
    //     updateSearch(hasRates ? 
    //       {
    //         status: 'success',
    //         searchVal1,
    //         searchVal2,
    //         displayRate: rates[searchVal1]
    //       }
    //     :
    //       {
    //         status: 'fail',
    //         message: 'Service Error! Please contact tech support (Fixer API returned success without rate object)',
    //       }
    //     )

    //   } else if (data.error && data.error.code === 202) {
    //     updateSearch({
    //       status: 'fail',
    //       message: `You requested ${searchBox1} and ${searchBox2}. Please check that these are valid currencies, and try again.`
    //     })

    //   } else if (data.error) {
    //     updateSearch({
    //       status: 'fail',
    //       message: `Service Error! Please contact tech support
    //       (Fixer API Error ${data.error.code}: ${data.error.message})`
    //     })

    //   } else {
    //     updateSearch({
    //       status: 'fail',
    //       message: `Service Error! Please contact tech support
    //       (Fixer API Error (null error object))`
    //     })
    //   }
    })
  }

  render() {
    return(
      <div id="container">
        <h1> Welcome to ForexCheckr!! </h1>

        <p>Enter currency codes to search for exchange rate:</p>

        <p>
          <code>
            Note: EUR base currency cannot be edited as for the time being (limitation of Fixer API Free tier)
          </code>
        </p>

        <div>
          <div><h4>Check for a rate</h4></div>
          &nbsp;
          To:
          &nbsp;

          <input
            id="searchBox1"
            placeholder="USD"
            onChange={(e) => this.setState({ searchBox1: formatForexCode(e.target.value) })}
            value={this.state.searchBox1}
          />
          
          &nbsp;
          From: 
          &nbsp;
          <input
            id="searchBox2"
            placeholder="EUR"
            onChange={(e) => this.setState(
              // { searchBox2: formatForexCode(e.target.value) }
              // disabled because Fixer API Demo only allows EUR Base currency
              { searchBox2: 'EUR' }
            )}
            value={this.state.searchBox2}
          />

          <button
            type="button"
            onClick={(e) => this.getForexRate({ 
              code1: this.state.searchBox1,
              code2: this.state.searchBox2
            })}
          >Search</button>
        </div>
      </div>
    )
  }
}