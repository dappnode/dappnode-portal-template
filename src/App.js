import React, { Component } from "react";
import logo from "./dappnode-logo.png";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ChainCard from "./ChainCard";
import providers from "./providers.json";
import Web3 from "web3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setBlock(chain, block) {
    if (!block.number) return;
    block.tick = true;
    this.setState({ [chain]: block });
    setTimeout(this.hideBlockTick.bind(this, chain), 300);
  }

  hideBlockTick(chain) {
    const block = this.state[chain];
    block.tick = false;
    this.setState({ [chain]: block });
  }

  handleError(chain, e) {
    console.log(`Error on ${chain}`, e);
  }

  componentDidMount() {
    for (const chain of Object.keys(providers)) {
      const web3 = new Web3(providers[chain].ws);
      web3.eth
        .getBlock("latest")
        .then(this.setBlock.bind(this, chain))
        .catch(this.handleError.bind(this, chain));
      web3.eth
        .subscribe("newBlockHeaders")
        .on("data", this.setBlock.bind(this, chain))
        .on("error", this.handleError.bind(this, chain));
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <React.Fragment>
          <CssBaseline />
          <AppBar position="static" color="default" className={classes.appBar}>
            <Toolbar>
              <div className={classes.toolbarTitle}>
                <img src={logo} alt="dappnode-logo" className={classes.logo} />
              </div>
              <Button>Decentralize</Button>
              <Button>Docs</Button>
            </Toolbar>
          </AppBar>
          <main className={classes.main}>
            <div className={classes.layout}>
              {/* Hero unit */}
              <div className={classes.heroContent}>
                <Typography variant="h2" gutterBottom>
                  Welcome to Web3 summit
                </Typography>
                <Typography variant="h6" color="textSecondary" component="p">
                  This template will help you understand how to publish
                  censorship-resistant, decentralized websites that protect
                  user's privacy.
                </Typography>
              </div>

              {/* Chain cards */}
              <Grid container spacing={40}>
                {Object.keys(this.state).map((chain, i) => (
                  <Grid item key={i}>
                    <ChainCard chain={chain} block={this.state[chain]} />
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

const styles = theme => ({
  "@global": { body: { backgroundColor: theme.palette.common.white } },
  appBar: { position: "relative" },
  toolbarTitle: { flex: 1 },
  logo: { height: "34px", position: "relative", top: "4px", flex: 1 },
  layout: { width: "auto", maxWidth: 800, margin: "auto" },
  main: { margin: "20px" },
  heroContent: { margin: "0 auto", padding: "64px 0 48px" }
});

export default withStyles(styles)(App);
