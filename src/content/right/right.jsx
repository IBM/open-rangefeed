import React from "react";
import PropTypes from "prop-types";
import Stock from "./stock/stock";
import "./right.css";
// import TweetList from '../tweet-list/tweet-list';

/**
 * Represents the right side of the view
 */
export default class Right extends React.Component {
  /**
   * React lifecycle method – Renders this component
   */
  render() {
    const {
      minimizeChart,
      stockModifier,
      companyInfo,
      stockStartingPrice,
      stockExchange,
      currency
    } = this.props;

    return (
      <section className="right">
        <Stock
          stockModifier={stockModifier}
          minimizeChart={minimizeChart}
          companyInfo={companyInfo}
          stockStartingPrice={stockStartingPrice}
          stockExchange={stockExchange}
          currency={currency}
          setView={this.props.setView}
          curViewIndex={this.props.curViewIndex}
          showTicks={this.props.showTicks}
        />
      </section>
    );
  }
}

Right.propTypes = {
  minimizeChart: PropTypes.bool,
  stockModifier: PropTypes.number,
  companyInfo: PropTypes.object,
  stockStartingPrice: PropTypes.number,
  stockExchange: PropTypes.string,
  currency: PropTypes.string,
  curViewIndex: PropTypes.number,
  setView: PropTypes.func,
  showTicks: PropTypes.bool
};

Right.defaultProps = {
  minimizeChart: false,
  stockModifier: 0,
  companyInfo: {},
  stockStartingPrice: 10,
  stockExchange: "NYSE",
  currency: "$",
  curViewIndex: 1,
  showTicks: true,
  setView: () => {}
};
