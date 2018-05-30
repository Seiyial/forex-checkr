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
      searchShow: { status: null },
      newRecordForm: { upperVal: '', lowerVal: '' },
      newRecordFormMessage: ''
    }
  }

  setNewRecordForm(that, field, value) {
    const obj = that.state.newRecordForm
    obj[field] = value
    that.setState({ newRecordForm: obj })
  }

  handleCreateRecord(that) {
    const {
      searchShow: { searchVal1, searchVal2, displayRate },
      newRecordForm: { upperVal, lowerVal }
    } = that.state
    const lower = parseFloat(lowerVal)
    const upper = parseFloat(upperVal)
    console.log('(*) searchVal1, searchVal2, upperVal, lowerVal, displayRate =>', searchVal1, searchVal2, upper, lower, displayRate)
    if (!upper || !lower) {
      return that.setState({ newRecordFormMessage: 'Please input the upper & lower limits.'})
    } else if (displayRate && (upper > displayRate) && (lower < displayRate)) {
      console.log('(*) handleCreateRecord =>', upperVal, lowerVal, displayRate)
      $.ajax({
        url: 'http://localhost:5000/forex_levels',
        type: 'POST',
        body: { searchVal1, searchVal2, upperVal, lowerVal, displayRate },
        success: (data, textStatus, jqXHR) => {
          console.log('(*) status =>', textStatus)
          that.setState({ newRecordFormMessage: 'successfully saved.' })
        },
        error: (jqXHR, textStatus, errorThrown) => {
          that.setState({ newRecordFormMessage: `error saving: ${textStatus}, ${errorThrown}`})
        }
      })
    } else {
      that.setState({ newRecordFormMessage: 'Please ensure the upper and lower limits are input correctly.' })
    }
  }

  getForexRate() {
    const searchVal1 = this.state.searchBox1
    const searchVal2 = this.state.searchBox2

    $.ajax({
      url: `http://localhost:5000/fixer_api/${searchVal1}/${searchVal2}`,
      data: '',
      crossDomain: true,
      success: (data, jQueryStatus, jqXHR) => {
        const { status, searchVal1, searchVal2, displayRate, errorMessage } = data
        if (status) {
          this.setState({
            searchShow: data,
            newRecordForm: { upperVal: '', lowerVal: '' },
            newRecordFormMessage: ''
          })
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
            onClick={(e) => this.getForexRate()}
          >Search</button>
        </div>

        <SearchDisplay
          searchShow={this.state.searchShow}
          handleCreateRecord={() => this.handleCreateRecord(this)}
          newRecordFormMessage={this.state.newRecordFormMessage}
          newRecordForm={this.state.newRecordForm}
          setNewRecordForm={(field, value) => this.setNewRecordForm(this, field, value)}
        />
      </div>
    )
  }
}