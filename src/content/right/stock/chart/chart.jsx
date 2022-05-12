import React from "react";
import PropTypes from "prop-types";
import "chartjs-plugin-annotation";
import { Line, defaults } from "react-chartjs-2";
import "./chart.css";
import Util from "../../../../util";

/**
 * Displays a chart, usually represents a stock
 */
export default class Stock extends React.Component {
  /**
   * Default constructor
   */
  constructor() {
    super();
    this.startHour = 6;
    this.initChart = this.initChart.bind(this);
    this.state = {
      data: [],
      labels: []
    };
  }

  /**
   * React lifecycyle method – Will be called when component has mounted.
   */
  componentDidMount() {
    if (this.startPrice) this.initChart();

    const { data, labels } = this.state;
    const updateInterval = 5000;
    let overallCounter = 0;
    let minDefault;
    let maxDefault;
    let min;
    let max;

    const setMinMaxDefaults = () => {
      // Don't fluctuate more than +/- 1%
      minDefault = this.startPrice * 0.99; // Smaller fluctuation
      maxDefault = this.startPrice * 1.01; // Smaller fluctuation
      min = minDefault; // Minimum stock price
      max = maxDefault; // Maximum stock price
    };

    if (this.startPrice) setMinMaxDefaults();

    // Fire a stock change every few seconds
    this.interval = setInterval(() => {
      if (!this.startPrice) return;

      if (
        this.prevStartPrice !== this.startPrice ||
        !this.prevStartPrice ||
        !minDefault ||
        !maxDefault ||
        !min ||
        !max
      ) {
        setMinMaxDefaults();
        this.prevStartPrice = this.startPrice;
      }

      overallCounter += 1;

      let stockModifier = 1;
      if (this.props.stockModifier > 0) {
        stockModifier = this.props.stockModifier / 100 + 1;
      } else if (this.props.stockModifier < 0) {
        stockModifier = 1 - (this.props.stockModifier / 100) * -1;
      }

      const randPrice = Util.getRand(min, max);
      const newPrice = randPrice * stockModifier;
      data.push(newPrice);
      if (overallCounter > 145) {
        data.shift();
        labels.shift();
      }
      this.curPrice = newPrice;
      labels.push(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      );

      // Update state
      this.setState({
        data,
        labels
      });

      // Let parent component know that price has changed
      this.props.onPriceChange(this.startPrice, newPrice);
    }, updateInterval);
  }

  /**
   * React lifecycle method
   * @param {object} props Props
   */
  UNSAFE_componentWillReceiveProps(props) {
    if (this.previousStockStartingPrice !== props.stockStartingPrice) {
      if (props.stockStartingPrice) {
        this.startPrice = props.stockStartingPrice;
        this.initChart();
      }
      this.previousStockStartingPrice = props.stockStartingPrice;
    }
    this.startPrice = props.stockStartingPrice;
  }

  /**
   * Called when component is about to unmount
   */
  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  initChart() {
    const { data, labels } = this.state;
    data.length = 0;
    labels.length = 0;
    const now = new Date().getHours();
    let variant = 0;

    // Create data + labels for chart
    if (now >= this.startHour) {
      // hours
      for (let i = 0; i < now - this.startHour; i += 1) {
        // minutes
        for (let j = 0; j < 6; j += 1) {
          variant += Util.getRand(-0.3, 0.3);
          const min = this.startPrice * 0.9;
          const max = this.startPrice * 1.1;
          const price =
            i === 0 && j === 0
              ? this.startPrice
              : Util.getRand(min, max) + variant;
          data.push(price);
          let mins = j * 10;
          if (mins === 0) mins = "00";
          const label = `${this.startHour + i}:${mins}`;
          labels.push(label);
        }
      }
    }

    this.setState({
      data,
      labels
    });
  }

  /**
   * React lifecycle method – Render the component
   */
  render() {
    const { className, currency, curViewIndex, showTicks } = this.props;
    const { data, labels } = this.state;
    const legend = { display: false };

    defaults.global.defaultFontFamily =
      "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif";
    defaults.global.defaultFontSize = "35";

    // Configure chart line
    const dataProp = {
      labels,
      datasets: [
        {
          lineTension: 0,
          borderColor:
            this.curPrice / this.startPrice < 0.72
              ? "rgb(191, 77, 77)"
              : "rgb(50, 200, 132)",
          backgroundColor:
            this.curPrice / this.startPrice < 0.72
              ? "rgba(191, 77, 77, 0.5)"
              : "rgba(50, 200, 132, 0.5)",
          borderWidth: "5",
          pointRadius: 0,
          data
        }
      ]
    };

    // Configure chart like axis and other stuff
    const options = {
      animation: false,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              callback: value => (showTicks ? `${currency} ${value}` : ``),
              beginAtZero: true,
              fontSize: curViewIndex === 1 ? 15 : 25
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              callback: value => (showTicks ? value : ``),
              maxTicksLimit: 3,
              maxRotation: 0,
              minRotation: 0,
              fontSize: curViewIndex === 1 ? 15 : 25
            }
          }
        ]
      },
      annotation: {
        annotations: [
          {
            // Draw horizontal line
            type: "line",
            mode: "horizontal",
            scaleID: "y-axis-0",
            value: this.startPrice,
            borderColor: "rgba(150, 150, 150, 0.5)",
            borderWidth: 4,
            label: {
              enabled: false,
              content: "Test label"
            }
          }
        ]
      }
    };

    return (
      <div className={className}>
        <div className="inner">
          <Line options={options} data={dataProp} legend={legend} />
        </div>
      </div>
    );
  }
}

// ///////////////////////////////////////////////////////////////
// //////////////////////// [PROP-TYPES] /////////////////////////
// ///////////////////////////////////////////////////////////////

Stock.propTypes = {
  className: PropTypes.string,
  onPriceChange: PropTypes.func,
  stockModifier: PropTypes.number,
  stockStartingPrice: PropTypes.number, // eslint-disable-line
  currency: PropTypes.string,
  curViewIndex: PropTypes.number,
  showTicks: PropTypes.bool
};

Stock.defaultProps = {
  className: "stock",
  onPriceChange: () => {},
  stockModifier: 0,
  stockStartingPrice: 10,
  currency: "$",
  curViewIndex: 1,
  showTicks: true
};
