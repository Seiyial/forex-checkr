import React from 'react'
import $ from 'jquery'
import _ from 'lodash'

class ForexLevelsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      levelData: {},
      liveRates: {},
      editForm: { upper: '', lower: '', id: '' }
    }
    this.refreshRecords()
    this.refreshLiveRates()
  }

  componentDidMount() {
    this.dbInterval = setInterval(() => this.refreshRecords(), 8000)
    // this.liveRatesInterval = setInterval(() => this.refreshLiveRates(), 3600000)
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

  getRowCssClassByStatus(item, liveRate) {
    let result = ''
    const liveRateValue = parseFloat(liveRate)

    if (liveRateValue > parseFloat(item.upper)) result = 'tr-highlight--green'
    if (liveRateValue < parseFloat(item.lower)) result = 'tr-highlight--red'
    return result
  }

  activateEditing(id) {
    const { data } = this.state.levelData
    console.log('(*) levelData =>', data)
    const { upper, lower, forex_name } = data.find(element => element.id === id)
    // Set Editing HTML
    const formContent = ({ upperVal, lowerVal }) => (
      <tr
        key={`forexListItemId-edit`}
      >
        <td>{forex_name}</td>
        <td>
          <div className='field'>
            <p className='control'>
              <input className='input' value={upperVal} onChange={(e) => this.setState({ editForm: { ...this.state.editForm, upper: e.target.value } })} />
            </p>
          </div>
        </td>
        <td>{this.pluckLiveRate(forex_name)}</td>
        <td>
          <div className='field'>
            <p className='control'>
              <input className='input' value={lowerVal} onChange={(e) => this.setState({ editForm: { ...this.state.editForm, lower: e.target.value } })} />
            </p>
          </div>
        </td>
        <td>
          <button className='button is-primary' onClick={() => this.updateRecord()}>Save</button>
        </td>
        <td>
          <button className='button is-info' onClick={() => this.cancelEditing()}>Cancel</button>
        </td>
      </tr>
    )
    // Set Edit Form State
    this.setState({ editForm: { id, upper, lower, formContent } })
    console.log('(*) this.state.editForm =>', this.state.editForm)
  }

  cancelEditing() {
    this.setState({ editForm: { id: '', upper: '', lower: '' } })
  }

  updateRecord() {
    const { editForm: { id, upper, lower } } = this.state
    $.ajax({
      url: `http://localhost:5000/forex_levels/${id}`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ id, upper, lower }),

      success: (payload, textStatus, jqXHR) => {
        if (payload.apiSuccess) {
          this.setState({ editForm: {} })
          this.refreshRecords()
        } else {
          window.alert('oops, please try again')
        }
      },

      error: (jqXHR, textStatus, errorThrown) => {
        window.alert(`oops, please try again (${textStatus}, ${errorThrown})`)
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
    const { levelData: { success, data, message }, editForm } = this.state
    console.log('(*) editForm =>', editForm)
    return(
      <div className='section'>
        <h4 className='subtitle is-4'>Saved Forex Levels</h4>
        {
          success ?
          <table className='table is-fullwidth'>
            <thead>
              <tr>
                <th>Forex</th>
                <th>Upper Limit</th>
                <th>Currently</th>
                <th>Lower Limit</th>
                <th colSpan='2'>Actions</th>
              </tr>
            </thead>
            <tbody>
            {
              (data.length > 0) ?
              (data.map((item) => {
                const liveRate = this.pluckLiveRate(item.forex_name)
                const trClassName = this.getRowCssClassByStatus(item, liveRate)
                return (
                  <React.Fragment key={`forexListItemId-${item.id}`}>
                  {
                    (editForm.id === item.id) ?
                    <editForm.formContent upperVal={editForm.upper} lowerVal={editForm.lower} />
                    :
                    <tr className={trClassName}>
                      <td>{item.forex_name}</td>
                      <td>{item.upper}</td>
                      <td>{this.pluckLiveRate(item.forex_name)}</td>
                      <td>{item.lower}</td>
                      <td>
                        <a href='' onClick={(e) => {e.preventDefault(); this.activateEditing(item.id)}}>Edit</a>
                      </td>
                      <td>
                        <a href='' onClick={(e) => {e.preventDefault(); this.deleteRecord(item.id)}}>Delete</a>
                      </td>
                    </tr>
                  }
                  </React.Fragment>
                )
              }))
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