/* eslint-disable no-else-return */
import React from "react";
import PropTypes from "prop-types";
import store from "react-couchdb-store";
import TweetList from "./tweet-list/tweet-list";
import dbSchema from "../db-schema-main";
import Right from "./right/right";
import Tweet from "./tweet-list/tweet/tweet";
import "./splitview.css";
import Util from "../util";

/**
 * Global wrapper component for this app
 */
export default class SplitView extends React.Component {
  constructor(props) {
    super(props);

    const { storeUtil } = store;

    this.ransomAttackTriggered = false;
    this.stickyRef = React.createRef();
    this.initializing = true;
    this.lastLeftTweetListCopy = [];
    this.updateTweetListTopPadding = this.updateTweetListTopPadding.bind(this);
    this.onNextTweetRequested = this.onNextTweetRequested.bind(this);

    this.curTweets = {
      positive: [],
      neutral: [],
      negative: []
    };

    // Default states
    this.state = {
      tweets: {
        positive: [],
        neutral: [],
        negative: []
      }
    };

    // Initialize with database schema
    storeUtil.init(dbSchema);

    // Fill initial states as defined in database schema
    storeUtil.createDefaultStates(this.state);

    // Reads data from database
    storeUtil.loadState(newState => {
      this.setState(newState);

      if (newState.companyNameTweet && this.curTweets) {
        this.replaceCompanyNames();
        this.quickUpdate();
      }

      if (newState.tweets) {
        const negativeTweets = newState.tweets.negative;

        for (let i = 0; i < negativeTweets.length; i += 1) {
          // Set flag for all negative tweets so they can be marked red later
          negativeTweets[i].mood = "negative";
        }

        if (this.state.companyNameTweet) this.replaceCompanyNames();
      }
      this.initializing = false;
    });

    // Get notified when database value changes
    storeUtil.registerEventListeners((newState, quickUpdate) => {
      if (this._isMounted === true) {
        this.setState(newState);

        if (newState.companyNameTweet) {
          if (this.curTweets) {
            this.replaceCompanyNames();
            this.quickUpdate();
            return;
          }
        }

        if (quickUpdate === true) {
          if (typeof this.quickUpdate === "function") this.quickUpdate();
          if (typeof this.quickUpdateRight === "function")
            this.quickUpdateRight();
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
   * Gets called when TweetList requires the next tweet
   */
  onNextTweetRequested() {
    const { curViewIndex } = this.props;
    if (curViewIndex === 1 || curViewIndex === 2 || curViewIndex === 3) {
      const { sentiment } = this.state;
      const ct = this.curTweets;

      if (sentiment < 0) {
        if (ct.negative.length === 0) {
          ct.negative = JSON.parse(JSON.stringify(this.state.tweets.negative));
          this.replaceCompanyNames(ct.negative);
        }
        return ct.negative.shift();
      } else if (sentiment >= 0 && sentiment <= 50) {
        if (ct.neutral.length === 0) {
          ct.neutral = JSON.parse(JSON.stringify(this.state.tweets.neutral));
          this.replaceCompanyNames(ct.neutral);
        }
        return ct.neutral.shift();
      }
      if (ct.positive.length === 0) {
        ct.positive = JSON.parse(JSON.stringify(this.state.tweets.positive));
        this.replaceCompanyNames(ct.positive);
      }

      const nextTweet = ct.positive.shift();
      return nextTweet;
    }
    return null;
  }

  /**
   * Replaces company name wild card with real company name in tweets
   * @param {Array} tweetsToParse The array of tweets to parse (optional)
   *                If no array is passed all tweets will be re-copied and parsed
   */
  replaceCompanyNames(tweetsToParse) {
    const cname = this.state.companyNameTweet;
    const tweets =
      tweetsToParse || JSON.parse(JSON.stringify(this.state.tweets));

    const runReplace = moodTweets => {
      for (let j = 0; j < moodTweets.length; j += 1) {
        const mt = moodTweets[j];
        const companyNameNoWhitespace = Util.replaceAll(cname, " ", "");
        mt.text = Util.replaceAll(
          mt.text,
          "COMPANY_NAME_NO_WHITESPACE",
          companyNameNoWhitespace
        );
        mt.text = Util.replaceAll(mt.text, "COMPANY_NAME", cname);
      }
    };

    if (tweetsToParse) {
      runReplace(tweetsToParse);
    } else {
      Object.keys(tweets).forEach(i => {
        runReplace(tweets[i]);
      });
      this.curTweets = tweets;
    }
  }

  /*
   * When sticky tweet is shown top padding needs to be adjusted
   */
  updateTweetListTopPadding(paddingTop) {
    setTimeout(() => {
      const tweetList = document.getElementsByClassName("tweet-list left")[0];
      if (tweetList) {
        if (typeof paddingTop === "undefined") {
          const stickyHeight = this.stickyRef.current.scrollHeight;
          tweetList.style.paddingTop = `${stickyHeight}px`;
        } else {
          tweetList.style.paddingTop = "0px";
        }
      }
    }, 100);
  }

  /**
   * React lifecycle method – Render this component
   */
  render() {
    const { style } = this.props;
    let customTweetUser;

    const {
      hashTag,
      customTweet,
      customTweetSentiment,
      customTweetImg, // Base64 format
      customTweetUserName,
      customTweetUserImg,
      customTweetUserVip,
      stockModifier,
      stockStartingPrice,
      stockExchange,
      currency,
      restart,
      companyName,
      companyNameImg,
      sentiment,
      customerTweet
    } = this.state;

    const tweetListStyle = {};
    const stickyStyle = {};
    let minimizeChart = false;

    // Restarts the app
    if (restart === true) {
      store.store
        .update(
          {
            _id: "restart",
            value: false
          },
          true
        )
        .then(() => {
          window.location.reload();
        });
      // window.location.reload();
    }

    // If a hashtag is set, split tweet stream into left and right
    if (hashTag) {
      minimizeChart = true;
      if (hashTag !== this.prevHashTag) {
        // TODO start populating right side view
      }
    }

    // If custom tweet or customer tweet is set, show it
    if (customTweet || customerTweet) {
      stickyStyle.transform = "translate3d(0, 390px, 0)";
      customTweetUser = {
        name: customTweetUserName,
        img: customTweetUserImg,
        vip: customTweetUserVip
      };

      if (this.stickyRef && this.stickyRef.current)
        this.updateTweetListTopPadding();
      else this.updateTweetListTopPadding(0);
    } else {
      this.updateTweetListTopPadding(0);
    }

    return (
      <div style={style} className="content">
        <div className="vert-line" />
        <div className="hor-line" />

        {/* Left side with tweets */}
        <TweetList
          registerQuickUpdate={callback => {
            this.quickUpdate = callback;
          }}
          style={tweetListStyle}
          className="tweet-list left"
          title="Social Media"
          sentiment={sentiment}
          requestNextTweet={this.onNextTweetRequested}
          curViewIndex={this.props.curViewIndex}
        >
          <div
            ref={this.stickyRef}
            style={stickyStyle}
            className="sticky-tweet"
          >
            {customerTweet && (
              <Tweet
                style={{ position: "relative", marginBottom: "20px" }}
                user={{ name: companyName, img: companyNameImg }}
                sentiment={50}
                vPos={0}
              >
                {customerTweet || ""}
              </Tweet>
            )}
            {customTweet && (
              <Tweet
                style={{ position: "relative" }}
                user={customTweetUser}
                img={customTweetImg}
                sentiment={customTweetSentiment}
                vPos={0}
              >
                {customTweet || ""}
              </Tweet>
            )}
          </div>
        </TweetList>

        {/* Right side */}
        <Right
          companyInfo={{ companyName, companyNameImg }}
          stockStartingPrice={parseInt(stockStartingPrice, 10)}
          stockModifier={stockModifier}
          stockExchange={stockExchange}
          currency={currency}
          minimizeChart={minimizeChart}
          registerQuickUpdate={callback => {
            this.quickUpdateRight = callback;
          }}
          registerReset={callback => {
            this.resetRight = callback;
          }}
          hashTag={hashTag}
          requestNextTweet={this.onNextTweetRequested}
          sentiment={sentiment}
          curViewIndex={this.props.curViewIndex}
          showTicks={this.props.showTicks}
        />
      </div>
    );
  }
}

SplitView.propTypes = {
  style: PropTypes.object,
  curViewIndex: PropTypes.number.isRequired,
  showTicks: PropTypes.bool
};

SplitView.defaultProps = {
  style: {},
  showTicks: true
};
