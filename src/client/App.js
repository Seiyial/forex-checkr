import React from 'react'
import $ from 'jquery'
import SearchDisplay from './components/SearchDisplay'

const formatForexCode = (input) => input.substring(0,3).toUpperCase()

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      searchBox1: '',
      searchBox2: 'EUR',
      searchShow: { status: null }
    }
  }

  getForexRate({ code1, code2 }) {
    const searchVal1 = this.state.searchBox1
    const searchVal2 = this.state.searchBox2

    $.ajax({
      url: `http://localhost:5000/fixer_api/${searchVal1}/${searchVal2}`,
      data: '',
      crossDomain: true,
      success: (data, jQueryStatus, jqXHR) => {
        const { status, searchVal1, searchVal2, displayRate, errorMessage } = data
        console.log('(*) data =>', data)
        if (status) {
          this.setState({ searchShow: data })
        } else {
          this.setState({ searchShow: {
            status: 'fail',
            errorMessage: 'Service Error! Please contact tech support (failed to call express fixerAPI endpoint)'
          } })
        }
      }
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

        <SearchDisplay
          searchShow={this.state.searchShow}
          handleSaveItem={this.handleSaveItem}
        />
      </div>
    )
  }
}