import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Header from "./Header";
import dwebregistryData from "./dwebregistry.json";
import isIPFS from "is-ipfs";
import Web3 from "web3";
import multihashes from "multihashes";
import "./App.css";

// ##### DEVELOPMENT
// dweb.eduadiez.eth
const rootNode =
  "0x44dbe9b8b4ddea870dc846f437c35b2eabc027ba6b08d972af65160f963ce0b2";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subdomain: "",
      hash: ""
    };
  }

  componentDidMount() {
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

  async publish() {
    this.setState({ errorMsg: null });
    const { subdomain, hash } = this.state;
    // function createDWeb(
    //   bytes32 _rootNode,
    //   string _label,
    //   string dnslink,
    //   bytes32 content
    // ) external returns (bytes32 node)

    const dnslink = `/ipfs/${hash}`;

    const buf = multihashes.fromB58String(hash);
    const dig = multihashes.decode(buf).digest;
    const content = `0x${multihashes.toHexString(dig)}`;

    const dwebRegistry = new window.web3js.eth.Contract(
      dwebregistryData.abi,
      dwebregistryData.address
    );

    const yourAddress = await this.getAccounts().catch(e => {
      console.log("Error getting accounts: ", e);
      this.setState({ errorMsg: e.message });
    });
    if (!yourAddress) return;

    const method = dwebRegistry.methods.createDWeb(
      rootNode,
      subdomain,
      dnslink,
      content
    );

    console.log({
      rootNode,
      subdomain,
      dnslink,
      content
    });

    const gasAmount = await method
      .estimateGas({
        from: yourAddress,
        gas: 5000000
      })
      .then(gas => (gas < 5000000 ? gas : null))
      .catch(e => {
        console.error("Error estimating gas: ", e);
        return null;
      });

    console.log("Gas amount: ", gasAmount);

    method
      .send({ from: yourAddress, gas: gasAmount || 250000 })
      .on("receipt", function(receipt) {
        this.showSuccess.bind(this);
      });

    const tx = {
      data: method.encodeABI(),
      to: dwebregistryData.address,
      gas: 250000,
      value: 0
    };
    this.setState({ tx });

    // window.web3js.eth
    //   .sendTransaction({
    //     from: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    //     to: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
    //     value: "1000000000000000"
    //   })
    //   .then(function(receipt) {
    //     console.log("Got receipt: ", receipt);
    //   });
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
    const hash = this.state.hash;
    const validHash = hash !== "" && !isIPFS.multihash(hash);
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

              <form
                style={{
                  display: "flex",
                  flexWrap: "wrap"
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  label="Subdomain (i.e. mydweb)"
                  style={{ marginBottom: "30px" }}
                  fullWidth={true}
                  value={this.state.subdomain}
                  onChange={this.handleSubdomain.bind(this)}
                />
                <TextField
                  label="IPFS hash (i.e. QmF2saa...)"
                  style={{ marginBottom: "30px" }}
                  error={validHash}
                  helperText={validHash ? "Introduce a valid IPFS hash" : ""}
                  fullWidth={true}
                  value={this.state.hash}
                  onChange={this.handleHash.bind(this)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.publish.bind(this)}
                >
                  PUBLISH
                </Button>
              </form>

              {this.state.tx ? (
                <div style={{ marginTop: "30px" }}>
                  <div className="hero-text">Tx data</div>
                  <div
                    style={{
                      backgroundColor: "#eae9e9",
                      border: "1px solid #e2e2e2",
                      padding: "15px",
                      overflowWrap: "break-word"
                    }}
                  >
                    <code>
                      {Object.keys(this.state.tx).map(key => (
                        <div>
                          <strong>{key}:</strong> {this.state.tx[key]}
                        </div>
                      ))}
                    </code>
                  </div>
                </div>
              ) : null}
            </div>
          </main>
        </React.Fragment>
      </div>
    );
  }
}

export default App;
