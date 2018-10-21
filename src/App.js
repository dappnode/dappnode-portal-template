import React, { Component } from "react";
import { isAddress } from "web3-utils";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ChainCard from "./ChainCard";
import Header from "./Header";
import providers from "./providers.json";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addr: ""
    };
  }

  addrChange(e) {
    const addr = e.target.value;
    this.setState({ addr });
    window.dispatchEvent(new CustomEvent("addrChange", { detail: { addr } }));
  }

  render() {
    const addressError = this.state.addr !== "" && !isAddress(this.state.addr);
    return (
      <div className="App">
        <React.Fragment>
          <CssBaseline />
          <Header />
          <main>
            <div className="layout">
              {/* Hero unit */}
              <div className="hero-content">
                <div className="hero-title" variant="h2" gutterBottom>
                  {/* 
                
                
                  Edit below
                
                
                  */}
                  Welcome to "name"
                  {/* 
                  
                  
                  Edit above
                  
                  
                  */}
                </div>
                <div className="hero-text">
                  This template will help you understand how to publish
                  censorship-resistant, decentralized websites that protect
                  user's privacy.
                </div>
              </div>

              <TextField
                label="Ethereum address"
                style={{ marginBottom: "30px" }}
                error={addressError}
                helperText={addressError ? "Introduce a valid address" : ""}
                fullWidth={true}
                onChange={this.addrChange.bind(this)}
              />

              {/* Chain cards */}
              <Grid container spacing={40}>
                {Object.keys(providers).map((provider, i) => (
                  <Grid key={i} item xs={3}>
                    <ChainCard provider={providers[provider]} />
                  </Grid>
                ))}
              </Grid>
            </div>
          </main>
        </React.Fragment>
      </div>
    );
  }
}

export default App;
