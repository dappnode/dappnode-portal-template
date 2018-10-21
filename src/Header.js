import React from "react";
import logo from "./dappnode-logo.png";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";

const Header = () => (
  <AppBar position="static" color="default" className="appbar">
    <Toolbar>
      <div className="toolbar">
        <img src={logo} alt="dappnode-logo" className="logo" />
      </div>
      <Button>Decentralize</Button>
      <Button>Docs</Button>
    </Toolbar>
  </AppBar>
);

export default Header;
