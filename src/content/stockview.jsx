import React from 'react';
import PropTypes from 'prop-types';
import store from 'react-couchdb-store';
import Right from './right/right';
import './stockview.css';

/**
 * Global wrapper component for this app
 */
export default class StockView extends React.Component {
  constructor(props) {
    super(props);

    const { storeUtil } = store;

    this.ransomAttackTriggered = false;
    this.stickyRef = React.createRef();
    this.initializing = true;
    this.lastLeftTweetListCopy = [];
    // this.onInfoClicked = this.onInfoClicked.bind(this);
    // this.updateTweetListTopPadding = this.updateTweetListTopPadding.bind(this);
    // this.onNextTweetRequested = this.onNextTweetRequested.bind(this);

    this.curTweets = {
      positive: [],
      neutral: [],
      negative: [],
    };

    // Default states
    this.state = {
    };

    // Reads data from database
    storeUtil.loadState((newState) => {
      this.setState(newState);
      this.initializing = false;
    });

    // Get notified when database value changes
    storeUtil.registerEventListeners((newState, quickUpdate) => {
      if (this._isMounted === true) {
        this.setState(newState);

        if (quickUpdate === true) {
          if (typeof this.quickUpdate === 'function') this.quickUpdate();
          if (typeof this.quickUpdateRight === 'function') this.quickUpdateRight();
        }
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * React lifecycle method – Render this component
   */
  render() {
    const { style } = this.props;

    const {
      hashTag,
      stockModifier,
      stockStartingPrice,
      stockExchange,
      currency,
      restart,
      companyName,
      companyNameImg,
      sentiment,
    } = this.state;

    let minimizeChart = false;

    // Restarts the app
    if (restart === true) {
      store.store.update({
        _id: 'restart',
        value: false,
      }, true).then(() => {
        window.location.reload();
      });
    }

    // If a hashtag is set, split tweet stream into left and right
    if (hashTag) {
      minimizeChart = true;
      if (hashTag !== this.prevHashTag) {
        // TODO start populating right side view
      }
    }

    return (
      <div style={style} className="content-stockview">
        <div className="vert-line" />
        <div className="hor-line" />

        {/* Right side */}
        <Right
          companyInfo={{ companyName, companyNameImg }}
          stockStartingPrice={parseInt(stockStartingPrice, 10)}
          stockModifier={stockModifier}
          stockExchange={stockExchange}
          currency={currency}
          minimizeChart={minimizeChart}
          registerQuickUpdate={(callback) => { this.quickUpdateRight = callback; }}
          registerReset={(callback) => { this.resetRight = callback; }}
          hashTag={hashTag}
          requestNextTweet={this.onNextTweetRequested}
          sentiment={sentiment}
          setView={this.props.setView}
          curViewIndex={this.props.curViewIndex}
        />
      </div>
    );
  }
}

StockView.propTypes = {
  style: PropTypes.object,
  curViewIndex: PropTypes.number.isRequired,
  setView: PropTypes.func,
};

StockView.defaultProps = {
  style: {},
  setView: () => {},
};
