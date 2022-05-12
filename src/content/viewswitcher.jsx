import React from "react";
import store from "react-couchdb-store";
import "core-js/es/array";
import TweetView from "./tweetview";
import StockView from "./stockview";
import SplitView from "./splitview";
import MultiStockView from "./multistockview";
import dbSchema from "../db-schema-main";

export default class ViewSwitcher extends React.Component {
  constructor() {
    super();
    this.state = { curViewIndex: 1, showTicks: true }; // Default is stock view
    this.setView = this.setView.bind(this);

    const { storeUtil } = store;

    // Initialize with database schema
    storeUtil.init(dbSchema);

    // Fill initial states as defined in database schema
    storeUtil.createDefaultStates(this.state);

    // Reads data from database
    storeUtil.loadState(newState => {
      this.setState(newState);
    });

    // Get notified when database value changes
    storeUtil.registerEventListeners((newState /* , quickUpdate */) => {
      if (this._isMounted === true) {
        this.setState(newState);
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setView(index) {
    this.setState({ curViewIndex: index });
  }

  render() {
    const { curViewIndex, showTicks } = this.state;
    const showStyles = { visibility: "visible", height: "100%" };
    const hideStyles = { visibility: "hidden", height: "0px" };

    const stock_style = curViewIndex === 1 ? showStyles : hideStyles;
    const tweet_style = curViewIndex === 2 ? showStyles : hideStyles;
    const split_style = curViewIndex === 3 ? showStyles : hideStyles;
    const multi_style = curViewIndex === 4 ? showStyles : hideStyles;

    return (
      <>
        <div style={stock_style}>
          <StockView
            curViewIndex={curViewIndex}
            setView={this.setView}
            showTicks={showTicks}
          />
        </div>
        <div style={tweet_style}>
          <TweetView curViewIndex={curViewIndex} setView={this.setView} />
        </div>
        <div style={split_style}>
          <SplitView
            curViewIndex={curViewIndex}
            setView={this.setView}
            showTicks={showTicks}
          />
        </div>
        <div style={multi_style}>
          <MultiStockView curViewIndex={curViewIndex} setView={this.setView} />
        </div>
      </>
    );
  }
}
