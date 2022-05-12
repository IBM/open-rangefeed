import TweetsJson from "./content/tweet-list/tweets.json";

const defaultTweetSet = TweetsJson.sets[0];

export default {
  stockStartingPrice1: { defaultValue: 50 },
  stockStartingPrice2: { defaultValue: 30 },
  stockStartingPrice3: { defaultValue: 80 },
  stockStartingPrice4: { defaultValue: 100 },
  hashTag: {
    defaultValue: "",
    // When reading from db make sure there is a hashtag at index 0
    postProcess: value => {
      if (value) return value.indexOf("#") === 0 ? value : `#${value}`;
      return "";
    },
    quickUpdate: true
  },
  customTweet: {
    defaultValue: "",
    payload: {
      img: "",
      userName: "",
      userImg: "",
      userVip: false
    }
  },
  customerTweet: {
    defaultValue: ""
  },
  stockStartingPrice: {
    defaultValue: 50
  },
  stockExchange: {
    defaultValue: "NYSE"
  },
  currency: {
    defaultValue: "$"
  },
  companyName: {
    defaultValue: "",
    payload: {
      img: "",
      tweet: ""
    }
  },
  sentiment: {
    defaultValue: 55,
    quickUpdate: true
  },
  stockModifier: {
    defaultValue: 0,
    quickUpdate: true
  },
  restart: {
    defaultValue: false
  },
  tweets: {
    defaultValue: {
      positive: defaultTweetSet.positive,
      neutral: defaultTweetSet.neutral,
      negative: defaultTweetSet.negative
    }
  },
  curViewIndex: {
    defaultValue: 1
  },
  showTicks: {
    defaultValue: true
  },
  companyName1: {
    defaultValue: "",
    payload: {
      img: "",
      tweet: ""
    }
  },
  companyName2: {
    defaultValue: "",
    payload: {
      img: "",
      tweet: ""
    }
  },
  companyName3: {
    defaultValue: "",
    payload: {
      img: "",
      tweet: ""
    }
  },
  companyName4: {
    defaultValue: "",
    payload: {
      img: "",
      tweet: ""
    }
  },

  stockModifier1: {
    defaultValue: 0,
    quickUpdate: true
  },
  stockModifier2: {
    defaultValue: 0,
    quickUpdate: true
  },
  stockModifier3: {
    defaultValue: 0,
    quickUpdate: true
  },
  stockModifier4: {
    defaultValue: 0,
    quickUpdate: true
  }
};
