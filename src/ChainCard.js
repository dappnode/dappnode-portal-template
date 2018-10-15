import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

class SimpleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      block: {},
      pendingTxCount: 0
    };
  }

  render() {
    const { block, chain } = this.props;
    const { number, gasLimit, gasUsed, miner, tick } = block;
    const gasRatio =
      gasUsed && gasLimit
        ? (100 * parseInt(gasUsed, 10)) / parseInt(gasLimit, 10)
        : 0;

    return (
      <Card
        style={{
          minWidth: 275,
          backgroundColor: tick ? "#22bcb2bf" : null,
          transition: "background-color 0.5s ease"
        }}
      >
        <CardContent>
          <Typography
            style={{ fontSize: 14 }}
            color="textSecondary"
            gutterBottom
          >
            {chain}
          </Typography>
          <Typography variant="h5" component="h2">
            {number || "..."}
          </Typography>
          <Typography style={{ marginBottom: 12 }} color="textSecondary">
            Gas usage: {gasRatio.toFixed(1)}%
          </Typography>
          <Typography component="p">
            Miner {miner ? miner.substring(0, 10) : ""}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default SimpleCard;
