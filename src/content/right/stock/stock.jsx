import React from "react";
import PropTypes from "prop-types";
import Chart from "./chart/chart";
import "./stock.css";

/**
 * Represents the stock view on the right
 */
export default class Stock extends React.Component {
  /**
   * Default constructor
   */
  constructor() {
    super();
    this.state = {
      price: 0,
      diffPercent: 0
    };
    this.oldPrice = 0;
    this.onPriceChange = this.onPriceChange.bind(this);
  }

  /**
   * Event handler – Gets called by chart component when price changes
   * @param {number} startPrice The initial start price of the day
   * @param {number} newPrice The current/new price
   */
  onPriceChange(startPrice, newPrice) {
    const decreaseValue = newPrice - startPrice;
    let diffPercent = ((decreaseValue / startPrice) * 100).toFixed(2);
    if (diffPercent > 0) diffPercent = `+${diffPercent}`;

    // Updates the price + percentage label at the top
    this.setState({
      price: Math.round(newPrice * 100) / 100,
      diffPercent
    });
  }

  /**
   * React lifecycle method – Renders this component
   */
  render() {
    let wrapperStyle;
    const { price, diffPercent } = this.state;
    const {
      minimizeChart,
      stockModifier,
      companyInfo,
      stockStartingPrice,
      style,
      stockExchange,
      currency,
      curViewIndex,
      showTicks
    } = this.props;
    const percentColorClass = diffPercent < 0 ? "red" : "";
    const minimizeChartClass = minimizeChart === true ? "minimized" : "";
    const button_style =
      curViewIndex === 1 ? { display: "block" } : { display: "none" };
    return (
      <>
        <div
          style={{ ...wrapperStyle, ...style }}
          className={`stock ${minimizeChartClass}`}
        >
          <div className="button-container" style={button_style}>
            <button
              className="view-button"
              type="submit"
              onClick={() => {
                this.props.setView(2);
              }}
            >
              View Social Media
            </button>
          </div>
          <div className="title">
            <div className="company-name">
              <img
                className="bo-logo"
                src={`${companyInfo.companyNameImg}`}
                alt=""
              />
              {companyInfo.companyName || ""}
              <span className="subtitle">{stockExchange}</span>
            </div>
            <div className="price">
              {currency}
              {price}
              <span className={`percent ${percentColorClass}`}>
                &nbsp;
                {diffPercent}%
              </span>
            </div>
          </div>
          <Chart
            stockModifier={stockModifier}
            className="chart"
            onPriceChange={this.onPriceChange}
            stockStartingPrice={stockStartingPrice}
            currency={currency}
            curViewIndex={curViewIndex}
            showTicks={showTicks}
          />
        </div>
      </>
    );
  }
}

Stock.propTypes = {
  minimizeChart: PropTypes.bool,
  stockModifier: PropTypes.number,
  companyInfo: PropTypes.object,
  stockStartingPrice: PropTypes.number,
  style: PropTypes.object,
  stockExchange: PropTypes.string,
  currency: PropTypes.string,
  curViewIndex: PropTypes.number,
  setView: PropTypes.func,
  showTicks: PropTypes.bool
};

Stock.defaultProps = {
  minimizeChart: false,
  stockModifier: 0,
  companyInfo: { companyName: "" },
  stockStartingPrice: 10,
  style: null,
  stockExchange: "NYSE",
  currency: "$",
  curViewIndex: 1,
  showTicks: true,
  setView: () => {}
};
