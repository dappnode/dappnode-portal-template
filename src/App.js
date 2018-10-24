import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./Header";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import dwebregistryData from "./dwebregistry.json";
import Web3 from "web3";
import providers from "./providers.json";
import "./App.css";

const web3 = new Web3(providers.mainnet.ws);

function belongsToRoot({ label, node, rootNode }) {
  const _node = web3.utils.sha3(rootNode + web3.utils.sha3(label).slice(2));
  return _node === node;
}

// ##### DEVELOPMENT
// dweb.eduadiez.eth
const rootNode =
  "0x44dbe9b8b4ddea870dc846f437c35b2eabc027ba6b08d972af65160f963ce0b2";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subdomain: "",
      hash: "",
      dwebs: []
    };
  }

  componentDidMount() {
    const dwebRegistry = new web3.eth.Contract(
      dwebregistryData.abi,
      dwebregistryData.address
    );

    const _this = this;

    dwebRegistry
      .getPastEvents("NewDWeb", {
        fromBlock: dwebregistryData.deployBlock,
        toBlock: "latest"
      })
      .then(events => {
        const dwebs = events
          .filter(event =>
            belongsToRoot({
              label: event.returnValues.label,
              node: event.returnValues.node,
              rootNode
            })
          )
          .map(event => ({
            name: event.returnValues.label,
            date: event.blockNumber,
            url: `http://${event.returnValues.label}.dweb.dappnode.eth/`
          }));
        _this.setState({ dwebs });
      });

    try {
      dwebRegistry.events
        .NewDWeb()
        .on("data", event => {
          if (
            belongsToRoot({
              label: event.returnValues.label,
              node: event.returnValues.node,
              rootNode
            })
          ) {
            const dwebs = _this.state.dwebs;
            dwebs.push({
              name: event.returnValues.label,
              date: event.blockNumber,
              url: `http://${event.returnValues.label}.dweb.dappnode.eth/`
            });
            _this.setState({ dwebs });
          }
        })
        .on("error", console.error);
    } catch (e) {
      // 
    }

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 === "undefined") {
      this.setState({ errorMsg: "You need MetaMask to publish your website" });
      return;
    }
    window.web3.version.getNetwork((err, netId) => {
      if (netId !== "1")
        this.setState({ errorMsg: "Please connect to mainnet" });
      window.web3js = new Web3(window.web3.currentProvider);
    });
  }

  getAccounts() {
    return new Promise((resolve, reject) => {
      window.web3js.eth.getAccounts(function(err, accounts) {
        if (err != null) {
          reject(err);
        } else if (accounts.length === 0) {
          reject(Error("MetaMask is locked"));
        } else {
          resolve(accounts[0]);
        }
      });
    });
  }

  showSuccess() {
    this.setState({ successMsg: "Published!" });
  }

  handleSubdomain(e) {
    let subdomain = e.target.value;
    subdomain = subdomain.replace(/\W/g, "");
    this.setState({ subdomain });
  }
  handleHash(e) {
    let hash = e.target.value;
    hash.replace("/ipfs/", "");
    hash.replace("ipfs/", "");
    this.setState({ hash });
  }

  render() {
    const dwebs = [];
    return (
      <div className="App">
        <React.Fragment>
          <CssBaseline />
          <Header />
          <main>
            <div
              className="layout"
              style={{
                maxWidth: "600px",
                margin: "0 auto"
              }}
            >
              {/* Hero unit */}
              <div className="hero-content">
                <div className="hero-title">Publish to ENS</div>
                <div className="hero-text">
                  Automatically register your website public dweb.dappnode.eth
                  domain on ENS
                </div>
              </div>

              {this.state.errorMsg ? (
                <h2 className="error-header">{this.state.errorMsg}</h2>
              ) : null}
              {this.state.successMsg ? (
                <h2 className="success-header">{this.state.successMsg}</h2>
              ) : null}

              <Grid container spacing={24}>
                {this.state.dwebs.map(dweb => (
                  <Grid item xs>
                    <Card className="clickable">
                      <CardContent classname="ellipsis">
                        <div
                          classname="card-content"
                          style={{
                            color: "#3c3c3c",
                            fontSize: "1.25rem",
                            fontWeight: 500,
                            lineHeight: 1.6,
                            letterSpacing: "0.0075em",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {dweb.name}
                        </div>
                        <div
                          classname="card-content"
                          style={{
                            color: "#8c8c8c",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            lineHeight: 1.6,
                            letterSpacing: "0.0075em",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {`${dweb.name}.dweb.dappnode.eth/`}
                        </div>
                        <div
                          classname="card-content"
                          style={{
                            color: "#b9b9b9",
                            fontSize: "1rem",
                            fontWeight: 500,
                            lineHeight: 1.6,
                            letterSpacing: "0.0075em",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {dweb.date}
                        </div>
                      </CardContent>
                      <CardActions>
                        <Button size="small" target="_blank" href={dweb.url}>
                          Visit
                        </Button>
                      </CardActions>
                    </Card>
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
