import React from 'react';
import PropTypes from 'prop-types';
import Util from '../../util';
import Tweet from './tweet/tweet';
import './tweet-list.css';

/**
 * Represents the list of tweets on the left
 */
export default class TweetList extends React.Component {
  /**
   * Default constructor for thid component
   */
  constructor() {
    super();
    this.state = {
      renderedTweets: [],
    };
    this.onTweetMoveIn = this.onTweetMoveIn.bind(this);
    this.showNextTweet = this.showNextTweet.bind(this);
  }

  /**
   * Will be called before component is mounted
   */
  UNSAFE_componentWillMount() {
    const { registerQuickUpdate, registerReset } = this.props;
    const { renderedTweets } = this.state;
    if (typeof registerQuickUpdate === 'function') {
      // Offer parent component a way to show the next tweet quickly
      registerQuickUpdate(() => {
        this.showNextTweet();
      });
    }
    if (typeof registerReset === 'function') {
      registerReset(() => {
        if (renderedTweets) {
          while (renderedTweets.length > 0) renderedTweets.pop();
          this.forceUpdate();
        }
      });
    }
  }

  /**
   * Called after this component has mounted
   */
  componentDidMount() {
    const nextTick = (delay) => {
      this.timer = setTimeout(() => {
        this.showNextTweet();
        const nextDelay = Math.round(Util.getRand(1000, 30000));
        nextTick(nextDelay);
      }, delay);
    };

    this.showNextTweet();
    const delay = Math.round(Util.getRand(2000, 60000));
    nextTick(delay);
  }

  /**
   * Called when component is about to unmount
   */
  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  /**
   * Event listener – Gets called when a new tweet enters the stage
   * @param {Number} height The height of the tweet
   */
  onTweetMoveIn(height) {
    const { renderedTweets } = this.state;
    for (let i = 0; i < renderedTweets.length; i += 1) {
      if (typeof renderedTweets[i].vPos === 'undefined' || isNaN(renderedTweets[i].vPos)) {
        renderedTweets[i].vPos = 0;
      } else {
        renderedTweets[i].vPos += height;
      }
    }
    this.forceUpdate();
  }

  /**
   * Shows the next tweet
   */
  showNextTweet() {
    const nextTweet = this.props.requestNextTweet();
    if (nextTweet) {
      this.state.renderedTweets.push(nextTweet);
      this.forceUpdate();
    }
  }

  /**
   * React lifecycle method – Renders this component
   */
  render() {
    let i = -1;
    const {
      className,
      showSentiment,
      title,
      style,
      sentiment,
    } = this.props;

    const { renderedTweets } = this.state;
    const sentimentValue = showSentiment === true ? sentiment : '';
    const button_style = this.props.curViewIndex === 2 ? { display: 'block' } : { display: 'none' };

    return (
      <div style={style} className={className}>
        <div className="title">
          <div style={{ width: '25%' }} />
          <div style={{ width: '75%', padding: '10px' }}>
            {title}
            &nbsp;
            <span className="sentiment-value">
              (sentiment:&nbsp;
              {sentimentValue}
              )
            </span>
          </div>
          <div className="button-container">
            <button className="view-button" style={button_style} type="submit" onClick={() => { this.props.setView(1); }}>View Stock</button>
          </div>
        </div>
        {this.props.children}
        <div
          className="tweet-container"
          ref={(el) => { this.tweetsContainer = el; return true; }}
        >
          {renderedTweets.map((d) => {
            i += 1;
            return (
              <Tweet
                disabled={d.disabled}
                onMoveIn={this.onTweetMoveIn}
                key={`tweetKey${i}`}
                img={d.img}
                vPos={d.vPos}
                user={d.user}
                mood={d.mood}
              >
                {d.text}
              </Tweet>
            );
          })}
        </div>
      </div>
    );
  }
}

// ///////////////////////////////////////////////////////////////
// //////////////////////// [PROP-TYPES] /////////////////////////
// ///////////////////////////////////////////////////////////////

TweetList.propTypes = {
  className: PropTypes.string,
  showSentiment: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.object,
  registerQuickUpdate: PropTypes.func,
  registerReset: PropTypes.func,
  children: PropTypes.object,
  requestNextTweet: PropTypes.func.isRequired,
  sentiment: PropTypes.number,
  curViewIndex: PropTypes.number,
  setView: PropTypes.func,
};

TweetList.defaultProps = {
  className: 'tweet-list',
  showSentiment: true,
  title: '',
  style: null,
  registerQuickUpdate: null,
  registerReset: null,
  children: null,
  sentiment: 0,
  curViewIndex: 1,
  setView: () => {},
};
