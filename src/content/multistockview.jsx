import React from "react";
import PropTypes from "prop-types";
import store from "react-couchdb-store";
import Stock from "./right/stock/stock";
import "./multistockview.css";

export default class MultiStockView extends React.Component {
  constructor() {
    super();
    this.state = {};
    const { storeUtil } = store;

    storeUtil.createDefaultStates(this.state);

    storeUtil.loadState(newState => {
      this.setState(newState);
    });

    storeUtil.registerEventListeners(newState => {
      if (this._isMounted === true) {
        console.log(newState);
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

  render() {
    const { style, curViewIndex } = this.props;
    const {
      stockStartingPrice1,
      stockStartingPrice2,
      stockStartingPrice3,
      stockStartingPrice4,
      companyName1,
      companyName2,
      companyName3,
      companyName4,
      companyName1Img,
      companyName2Img,
      companyName3Img,
      companyName4Img,
      stockModifier1,
      stockModifier2,
      stockModifier3,
      stockModifier4
    } = this.state;

    return (
      <div
        className="multistockview content"
        style={{
          ...style,
          width: "100%",
          height: "100%",
          display: "block"
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "50%" }}>
          <Stock
            style={{ paddingLeft: "40px", height: "100%" }}
            stockModifier={stockModifier1}
            minimizeChart={false}
            stockMarket=""
            companyInfo={{
              companyName: companyName1,
              companyNameImg: companyName1Img
            }}
            stockStartingPrice={parseInt(stockStartingPrice1, 10)}
            curViewIndex={curViewIndex}
          />
          <Stock
            style={{ height: "100%", marginLeft: "50%" }}
            stockModifier={stockModifier2}
            minimizeChart={false}
            stockMarket=""
            companyInfo={{
              companyName: companyName2,
              companyNameImg: companyName2Img
            }}
            stockStartingPrice={parseInt(stockStartingPrice2, 10)}
            curViewIndex={curViewIndex}
          />
        </div>

        <div
          style={{
            borderTop: "4px solid transparent",
            position: "relative",
            width: "100%",
            height: "50%"
          }}
        >
          <Stock
            style={{ paddingLeft: "40px", height: "100%" }}
            stockModifier={stockModifier3}
            minimizeChart={false}
            stockMarket=""
            companyInfo={{
              companyName: companyName3,
              companyNameImg: companyName3Img
            }}
            stockStartingPrice={parseInt(stockStartingPrice3, 10)}
            curViewIndex={curViewIndex}
          />
          <Stock
            style={{ height: "100%", marginLeft: "50%" }}
            stockModifier={stockModifier4}
            minimizeChart={false}
            stockMarket=""
            companyInfo={{
              companyName: companyName4,
              companyNameImg: companyName4Img
            }}
            stockStartingPrice={parseInt(stockStartingPrice4, 10)}
            curViewIndex={curViewIndex}
          />
        </div>
      </div>
    );
  }
}

MultiStockView.propTypes = {
  style: PropTypes.object,
  curViewIndex: PropTypes.number
};

MultiStockView.defaultProps = {
  style: {},
  curViewIndex: 0
};
