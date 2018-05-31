import React from 'react'
import $ from 'jquery'
import { SearchDisplay, ForexLevelsList } from './components'
import './styles/main.scss'

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

      const payload = JSON.stringify({ searchVal1, searchVal2, upperVal, lowerVal, displayRate })

      $.ajax({
        url: 'http://localhost:5000/forex_levels',
        type: 'POST',
        contentType: 'application/json',
        data: payload,

        success: (data, textStatus, jqXHR) => {
          const message = data.success ? 'Successfully saved.' : (data.message || '')
          that.setState({ newRecordFormMessage: message, searchShow: { status: null } })
        },

        error: (jqXHR, textStatus, errorThrown) => {
          that.setState({ newRecordFormMessage: `error saving: ${textStatus}, ${errorThrown}`})
        }
      })

    } else {
      that.setState({ newRecordFormMessage: 'Please ensure that the upper and lower limits have been input correctly.' })
    }
  }

  getForexRate() {
    const searchVal1 = this.state.searchBox1
    const searchVal2 = this.state.searchBox2

    $.ajax({
      url: `http://localhost:5000/fixer_api/${searchVal1}/${searchVal2}`,
      type: 'GET',
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
      <div id='fullContainer' className='bg--gradient'>
        <div className='columns'>
          <div className='column' />
          <div className='column is-three-quarters-mobile is-three-quarters-tablet is-half-desktop bg--white-plank mt-50 page--container-shadow'>
            <h1 className='title'> Welcome to ForexCheckr!! </h1>

            <div className='section'>
              <h4 className='subtitle is-4'>Add a Rate</h4>
              <p>
                  Enter currency codes to search for an exchange rate.<br />
                  <small>Note: EUR base currency cannot be edited as for the time being</small>
              </p>
              
              <div className='field'>
                <label className='label'>To:</label>
                <div className='field'>
                  <p className='control'>
                    <input
                      className='input'
                      id='searchBox1'
                      placeholder='eg. USD'
                      onChange={(e) => this.setState({ searchBox1: formatForexCode(e.target.value) })}
                      value={this.state.searchBox1}
                    />
                  </p>
                </div>
                <label className='label'>From:</label>
                <div className='field'>
                  <p className='control'>
                    <input
                      className='input'
                      id='searchBox2'
                      placeholder='EUR'
                      onChange={(e) => this.setState(
                        // { searchBox2: formatForexCode(e.target.value) }
                        // disabled because Fixer API Demo only allows EUR Base currency
                        { searchBox2: 'EUR' }
                      )}
                      value={this.state.searchBox2}
                    />
                  </p>
                </div>
              </div>
              <div className='field'>
                <div className='field-label' />
                <div className='field-body'>
                  <div className='field'>
                    <div className='control'>
                      <button type='button' className='button is-primary' onClick={(e) => this.getForexRate()}>
                        Search
                      </button>
                    </div>
                  </div>
                </div>
                <div className='field-label' />
                <div className='field-body' />
              </div>
            </div>

            <SearchDisplay
              searchShow={this.state.searchShow}
              handleCreateRecord={() => this.handleCreateRecord(this)}
              newRecordFormMessage={this.state.newRecordFormMessage}
              newRecordForm={this.state.newRecordForm}
              setNewRecordForm={(field, value) => this.setNewRecordForm(this, field, value)}
            />

            <ForexLevelsList />
          </div>
          <div className='column' />
        </div>
      </div>
    )
  }
}