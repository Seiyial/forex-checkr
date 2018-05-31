import React from 'react'
import $ from 'jquery'

class ForexLevelsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      levelData: {}
    }
    this.refreshRecords()
  }

  componentDidMount() {
    this.interval = setInterval(() => this.refreshRecords(), 4000);
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }

  refreshRecords() {
    let result
    $.ajax({
      url: 'http://localhost:5000/forex_levels',
      type: 'GET',
      contentType: 'application/json',

      success: (payload, textStatus, jqXHR) => {
        // console.log('(*) textStatus =>', textStatus)
        // console.log('(*) data =>', payload)
        const { apiSuccess, dbPayload, message } = payload
        if (!apiSuccess || textStatus !== 'success') {
          console.log('apiSuccess', apiSuccess, 'textStatus', textStatus, 'dbPayload', dbPayload)
          this.setState({ levelData: { success: false, message } })
        } else {
          this.setState({ levelData: { success: true, data: dbPayload } })
        }
      }
    })
  }

  deleteRecord(id) {
    const reallyDelete = window.confirm('Are you sure?')
    if (reallyDelete) {
      console.log('(*) begin deleting!')
    }
  }

  render() {
    // console.log('(*) this.state.levelData =>', this.state.levelData)
    const { levelData: { success, data, message } } = this.state
    return(
      <div>
        <h4>Saved Forex Levels</h4>
        {
          success ?
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Forex</th>
                <th>Upper Limit</th>
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
                  <td>{item.id}</td>
                  <td>{item.forex_name}</td>
                  <td>{item.upper}</td>
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