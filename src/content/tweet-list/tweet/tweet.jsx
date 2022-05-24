import React from "react";
import PropTypes from "prop-types";
import { Favorite32, Renew32, Reply32 } from "@carbon/icons-react";
import Util from "../../../util";
import "./tweet.css";

/**
 * A component that represents a Tweet
 * MAX CHARS PER TWEET: 65 letters !!!!
 */
export default class Tweet extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.faceId = Math.round(Util.getRand(0, this.getNumProfileImages()));
    // Reply counter for "angry tweets"
    this.replyCountLarge = this.getRand(1, 999);

    // 50-50 chance that this tweet has numbers next to icons if "not angry".
    const hasReplyCountSmall = this.getRand(1, 10) >= 5;
    this.replyCountSmall =
      hasReplyCountSmall === true ? this.getRand(1, 3) : "";
  }

  componentDidMount() {
    const { onMoveIn } = this.props;
    if (typeof onMoveIn === "function") {
      const myHeight = Util.getFullHeight(this.myRef.current);
      onMoveIn(myHeight, this.myRef);
    }
  }

  getNumProfileImages() {
    return (
      require
        .context(
          "../../../../public/img/faces/legacy",
          false,
          /\.(png|jpe?g|svg)$/
        )
        .keys().length - 1
    );
  }

  /**
   * Returns a random value between min and max
   * @param {Number} min The minimum range
   * @param {Number} max The maximum range
   */
  getRand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  /**
   * Converts e.g. 1200 to 1.2k
   * @param {Number} value The value to convert
   */
  toKnotation(value) {
    if (typeof value === "number" && value >= 1000) {
      return `${Math.round(value / 100) / 10}k`;
    }
    return value;
  }

  /**
   * Renders this component
   */
  render() {
    const {
      children,
      img,
      className,
      vPos,
      user,
      disabled,
      mood,
      style
    } = this.props;

    let fullImgPath = img;
    let hasImgClass = "";
    let hiddenClass = "";
    let usrHandle = "";
    let userNameVisibility = "hidden";
    let rightHasName = "";
    let facePath = `${process.env.PUBLIC_URL}/img/faces/legacy/${this.faceId}.jpeg`;

    const replyCount =
      mood === "negative" ? this.replyCountLarge : this.replyCountSmall;
    const replyCountKnotation = this.toKnotation(replyCount);
    const rtCount = this.toKnotation(
      typeof replyCountKnotation === "string"
        ? ""
        : Math.round(replyCountKnotation * 1.6)
    );
    const likeCount = this.toKnotation(
      typeof replyCountKnotation === "string"
        ? ""
        : Math.round(replyCountKnotation * 2.1)
    );
    const vPosCorrected = `translate3d(0, ${vPos}px, 0)`;
    const outerStyle = { ...style, transform: vPosCorrected };

    // Use path instead of base64 if img refers to a file
    if (img && img.indexOf("data:image") !== 0)
      fullImgPath = `${process.env.PUBLIC_URL}/img/${img}`;
    if (fullImgPath) hasImgClass = "has-img";
    if (disabled === true) hiddenClass = "hidden";

    if (user) {
      if (user.img) {
        if (user.img.indexOf("data:image") === 0) facePath = user.img;
        else
          facePath = `${process.env.PUBLIC_URL}/img/faces/special/${user.img}`;
      }
      if (user.name) {
        userNameVisibility = "";
        usrHandle = user.name;
        rightHasName = "has-name";
      }
    }

    return (
      <div
        style={outerStyle}
        className={`tweet ${mood} ${className} ${hasImgClass} ${hiddenClass}`}
        mood={mood}
        ref={this.myRef}
      >
        <div className="symbol">!</div>
        <img className="face" src={facePath} alt="" />
        <div className={`right ${rightHasName}`}>
          <div className={`name ${userNameVisibility}`}>
            {usrHandle}
            {user && user.vip === true && (
              <img
                className="icon-verified"
                src={`${process.env.PUBLIC_URL}/img/verified.png`}
                alt=""
              />
            )}
          </div>
          <div className="text">{children}</div>
          {img && <img className="img" src={fullImgPath} alt="" />}
          <div className="icons">
            <div className="icon-wrapper">
              <Reply32 aria-label="Add" className="icon" />
              <div className="count">{replyCountKnotation}</div>
            </div>
            <div className="icon-wrapper">
              <Renew32 aria-label="Add" className="icon" />
              <div className="count">{rtCount}</div>
            </div>
            <div className="icon-wrapper">
              <Favorite32 aria-label="Add" className="icon" />
              <div className="count">{likeCount}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// ///////////////////////////////////////////////////////////////
// //////////////////////// [PROP-TYPES] /////////////////////////
// ///////////////////////////////////////////////////////////////

Tweet.propTypes = {
  children: PropTypes.string.isRequired,
  img: PropTypes.string,
  onMoveIn: PropTypes.func,
  className: PropTypes.string,
  vPos: PropTypes.number,
  user: PropTypes.object,
  disabled: PropTypes.bool,
  mood: PropTypes.string,
  style: PropTypes.object
};

Tweet.defaultProps = {
  img: null,
  onMoveIn: null,
  className: "",
  vPos: 0,
  user: null,
  disabled: false,
  mood: "",
  style: null
};
