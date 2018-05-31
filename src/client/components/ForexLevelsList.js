import React from 'react'
import $ from 'jquery'

class ForexLevelsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      levelData: {},
      liveRates: {}
    }
    this.refreshRecords()
    this.refreshLiveRates()
  }

  componentDidMount() {
    this.dbInterval = setInterval(() => this.refreshRecords(), 8000)
    this.liveRatesInterval = setInterval(() => this.refreshLiveRates(), 10000)
  }
  componentWillUnmount() {
    clearInterval(this.dbInterval)
  }

  refreshLiveRates() {
    $.ajax({
      url: 'http://localhost:5000/fixer_api',
      type: 'GET',
      data: '',
      crossDomain: true,

      success: (payload, jQueryStatus, jqXHR) => {
        const { status, allRates, errorMessage } = payload
        if (status && status === 'success') {
          this.setState({ liveRates: { status, allRates } })
          console.log('refresh live rates -ok', this.state.liveRates)
        } else if (status) {
          this.setState({ liveRates: { status, errorMessage } })
        } else {
          this.setState({ liveRates: { status: 'fail', errorMessage: 'Server Error! Failed to call endpoint)' } })
        }
      },

      error: (payload, jQueryStatus, jqXHR) => {
        this.setState({ liveRates: { status: 'fail', errorMessage: `Service Error! Failed to call endpoint (${jQueryStatus}, ${JSON.stringify(payload)})` } })
      }
    })
  }

  pluckLiveRate(forexName) {
    // this method will need refactoring upon Fixer API's support of non-EUR base currency.
    const currency1 = forexName.substring(0,3)
    const currency2 = forexName.substring(4,7)
    if (currency2 !== 'EUR') {
      return 'N/A'
    } else if (!this.state.liveRates.allRates) {
      return '---'
    } else {
      return this.state.liveRates.allRates[currency1] || `${currency1} not found`
    }
  }

  refreshRecords() {
    let result
    $.ajax({
      url: 'http://localhost:5000/forex_levels',
      type: 'GET',
      contentType: 'application/json',

      success: (payload, textStatus, jqXHR) => {
        const { apiSuccess, dbPayload, message } = payload
        if (!apiSuccess || textStatus !== 'success') {
          console.log('apiSuccess', apiSuccess, 'textStatus', textStatus, 'dbPayload', dbPayload)
          this.setState({ levelData: { success: false, message } })
        } else {
          console.log('(#) refresh records (ok)')
          this.setState({ levelData: { success: true, data: dbPayload } })
        }
      }
    })
  }

  deleteRecord(id) {
    const reallyDelete = window.confirm('Are you sure?')
    if (reallyDelete) {
      const payload = JSON.stringify({ id })
      console.log('(*) begin deleting', payload)
      $.ajax({
        url: 'http://localhost:5000/forex_levels',
        type: 'DELETE',
        contentType: 'application/json',
        data: payload,

        success: (data, textStatus, jqXHR) => {
          if (data.apiSuccess) {
            this.refreshRecords()
            // window.alert('successfully deleted')
          } else {
            window.alert('oops, please try again')
          }
        },

        error: (jqXHR, textStatus, errorThrown) => {
          window.alert(`oops, please try again (${textStatus}, ${errorThrown})`)
        }
      })
    }
  }

  render() {
    const { levelData: { success, data, message } } = this.state
    return(
      <div>
        <h4>Saved Forex Levels</h4>
        {
          success ?
          <table>
            <thead>
              <tr>
                <th>Forex</th>
                <th>Upper Limit</th>
                <th>Current Rate</th>
                <th>Lower Limit</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              (data.length > 0) ?
              (data.map((item) => (
                <tr key={`forexListItemId-${item.id}`}>
                  <td>{item.forex_name}</td>
                  <td>{item.upper}</td>
                  <td>{this.pluckLiveRate(item.forex_name)}</td>
                  <td>{item.lower}</td>
                  <td>{item.status ? '✓' : 'X'}</td>
                  <td><a href='' onClick={(e) => {e.preventDefault(); this.deleteRecord(item.id)}}>Delete</a></td>
                </tr>
              )))
              :
              (<tr>
                <td colspan='5'>No data</td>
              </tr>)
            }
            </tbody>
          </table>
          :
          <div>Error obtaining data</div>
        }
      </div>
    )
  }
}

export default ForexLevelsList