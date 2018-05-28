import React from 'react'

const forexCode = (input) => {
  let value = input.substring(0,3).toUpperCase()
  console.log("Input formatted", value)
  return value
}

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      title: 'Forexer',
      searchBox1: '',
      searchBox2: 'EUR'
    }
  }

  searchForexCode({ code1, code2 }) {
    console.log("Search forex code", code1, code2)
  }

  render() {
    console.log("This.", this)
    return(
      <div id="container">
        <h1> HI there! { this.state.a }! </h1>

        <p>Enter currency codes to search for exchange rate:</p>

        &nbsp;
        from:
        &nbsp;

        <input
          id="searchBox1"
          placeholder="USD"
          onChange={(e) => this.setState({ searchBox1: forexCode(e.target.value) })}
          value={this.state.searchBox1}
        />
        
        &nbsp;
        to: 
        &nbsp;
        <input
          id="searchBox2"
          placeholder="EUR"
          onChange={(e) => this.setState(
            // { searchBox2: forexCode(e.target.value) }
            // disabled because Fixer API Demo only allows EUR Base currency
            { searchBox2: 'EUR' }
          )}
          value={this.state.searchBox2}
        />

        <button
          type="button"
          onClick={(e) => this.searchForexCode({ 
            code1: this.state.searchBox1,
            code2: this.state.searchBox2
          })}
        >Search</button>
      </div>
    )
  }
}