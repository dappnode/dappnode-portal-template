import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Web3 from "web3";

class SimpleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setBlock = this.setBlock.bind(this);
    this.setBalance = this.setBalance.bind(this);
    this.hideBlockTick = this.hideBlockTick.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  setBlock(block) {
    if (!block) return;
    this.setState(block);
    this.setState({ tick: true });
    setTimeout(this.hideBlockTick, 300);
  }

  setBalance(balance) {
    this.setState({ balance });
  }

  hideBlockTick() {
    this.setState({ tick: false });
  }

  handleError(e) {
    console.log(`Error on ${this.props.provider.name}`, e);
  }

  componentDidMount() {
    const web3 = new Web3(this.props.provider.ws);
    web3.eth
      .isSyncing()
      .then(this.setBlock)
      .catch(this.handleError);
    web3.eth
      .getBlock("latest")
      .then(this.setBlock)
      .catch(this.handleError);
    web3.eth
      .subscribe("newBlockHeaders")
      .on("data", this.setBlock)
      .on("error", this.handleError);
    // Subscribe to addr changes
    window.addEventListener("addrChange", e => {
      const { addr } = e.detail;
      if (!web3.utils.isAddress(addr)) return;
      web3.eth
        .getBalance(addr)
        .then(web3.utils.fromWei)
        .then(this.setBalance)
        .catch(this.handleError);
    });
  }

  render() {
    const chainName = this.props.provider.name;
    let { number, tick, highestBlock, currentBlock, balance } = this.state; // this.state = block
    let block = !number && highestBlock && currentBlock ? "Syncing" : number;
    if (balance && balance !== "0") balance = parseFloat(balance).toFixed(6);

    return (
      <Card
        className="card"
        style={{ backgroundColor: tick ? "#22bcb2bf" : null }}
      >
        <CardContent>
          <div className="card-name">{chainName}</div>
          <div className="card-block">{block || "..."}</div>
          <h2 className="card-balance">{balance}</h2>
        </CardContent>
      </Card>
    );
  }
}

export default SimpleCard;
