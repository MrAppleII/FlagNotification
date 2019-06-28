import React, { Component } from "react"
import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"

import successLogo from "./icons/successLogo.svg"
import alertLogo from "./icons/alertLogo.svg"
import failedLogo from "./icons/failedLogo.svg"
import infoLogo from "./icons/infoLogo.svg"
/*
  File: FlagNotification.js
  Description: Creates a small alert on the bottom left of the screen. It will stay for 5 seconds if no prop time is passed in. 
  After fading in and the timer running out, it will call a prop function which by default does nothing. At the 
  end you can set the flag visibility to false hide the flag.

  Props:  
  flagType: PropTypes.string,  Sets the kind of alter to display. Can be "alert","success","info", and "fail"
  isVisible: PropTypes.bool,   Default is true. Sets if it is visible. When set to true, it will stay open until the prop is false.
  message: PropTypes.string,   Default is "Notice Given". It is the message that is meant to be displayed to the user. 
  flagTime: PropTypes.number,  Sets how long to display the flag for in miliseconds. The default is 5
  onVisibilityEnd: PropTypes.func, This a function that is called at the end of the notification animation.
*/
class FlagNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flagColor: "#000",
      iconUrl: infoLogo,
      photoSize: 40,
      fadedIn: false,
      alertColor: "rgba(240, 173, 78,0.95)",
      successColor: "rgba(92, 184, 92,0.95)",
      failColor: "rgba(212, 63, 58,0.95)",
      infoColor: "rgba(0,0,0,0.95",
    }
    this.timer = null;
  }
  componentDidMount() {
    try {
      this.setFlagInfo(this.props)
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
        this.setFlagParams(this.state.infoColor, infoLogo, 40) //This is the default flag
      }
    }
  }
  componentWillUnmount() {}
  componentDidUpdate(){
    clearTimeout(this.timer);
 }
  setVisibility = () => {
    console.log("setting fade out: ",this.state.fadedIn)
    this.setState({
      fadedIn: false,
    }, () =>{
      this.props.onFlagEnd()
    })
    
  }

  setFadedIn = () => {

    this.timer=setTimeout(
      function() {
        console.log("setting fade in",this.state.fadedIn)
        if(this.state.fadedIn!==true&&this.props.isVisible===true){
          this.setState({
            fadedIn: true,
          })
        }
       
      }.bind(this),
      this.props.flagTime * 500
    )
  }

  setFlagInfo = props => {
    if ("info".match(props.flagType) || "Info".match(props.flagType)) {
      this.setFlagParams(this.state.infoColor, infoLogo, 40)
    } else if ("alert".match(props.flagType) || "Alert".match(props.flagType)) {
      this.setFlagParams(this.state.alertColor, alertLogo, 40)
    } else if (
      "success".match(props.flagType) ||
      "Success".match(props.flagType)
    ) {
      this.setFlagParams(this.state.successColor, successLogo, 40)
    } else if ("fail".match(props.flagType) || "Fail".match(props.flagType)) {
      this.setFlagParams(this.state.failColor, failedLogo, 40)
    } else {
      this.setFlagParams(this.state.infoColor, infoLogo, 40) //This is the default flag
    }
  }
  setFlagParams = (color, url, size) => {
    this.setState({
      flagColor: color,
      iconUrl: url,
      photoSize: size,
    })
  }
  handleFlagClick = () => {
    this.setState({
      fadedIn: true,
    })
  }

  render() {
    try {
      return this.props.isVisible
        ? ReactDOM.createPortal(
            !this.state.fadedIn ? (
              <FlagContainer
                className="show"
                onAnimationEnd={this.setFadedIn}
                style={{ backgroundColor: this.state.flagColor }}
                onClick={this.handleFlagClick}
              >
                <Col>
                  <AlertImg
                    src={this.state.iconUrl}
                    width={this.state.photoSize}
                    height={this.state.photoSize}
                    alt="status logo"
                  />

                  <MessageText>{this.props.message}</MessageText>
                </Col>
              </FlagContainer>
            ) : (
              <FlagContainer
                onAnimationEnd={this.setVisibility}
                className="hide"
                style={{ backgroundColor: this.state.flagColor }}
              >
                <Col>
                  <AlertImg
                    src={this.state.iconUrl}
                    width={this.state.photoSize}
                    height={this.state.photoSize}
                    alt="status logo"
                  />

                  <MessageText>{this.props.message}</MessageText>
                </Col>
              </FlagContainer>
            ),
            document.body
          )
        : null
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
// Animation defintions
const FadeIn = keyframes`
from {
  opacity: 0.2;
  transform: translateY(100%);
 
} 
to {
  transform: translateY(0%);
opacity: 1.0;
}
`
const FadeOut = keyframes`
from {
  transform: translateY(0%);
  opacity: 1.0;
} 
to {
  transform: translateY(100%);
  opacity: 0;
  
}
`

const MessageText = styled.div`
  margin-left: 8px;
`
const FlagContainer = styled.div`
  /* Fonts */
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: #fff;

  /* Visibility and Opacity */
  visibility: hidden;

  /* Appearence */
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  margin: 12px;
  padding: 8px;
  border-radius: 2px;

  /* Item Alignment */
  flex-wrap: wrap;
  align-items: center;

  /* Positioning */
  position: fixed;
  z-index: 999;
  left: 24px;
  right: auto;
  bottom: 24px;

  will-change: transform, opacity, bottom;

  &.show {
    visibility: visible;

    animation: ${FadeIn} 0.25s;
  }
  &.hide {
    visibility: visible;
    animation: ${FadeOut} 0.25s;
  }

  @media (min-width: 300px) {
    flex-grow: initial;
    min-width: 288px;
  }
`

const Col = styled.span`
  position: relative;
  display: flex;
  align-items: center;
`
// This is the positioning for the image itself. 
const AlertImg = styled.img`
  margin-top: auto;
  margin-bottom: auto;
`
FlagNotification.propTypes = {
  flagType: PropTypes.string,
  isVisible: PropTypes.bool,
  message: PropTypes.string,
  flagTime: PropTypes.number,
  onVisibilityEnd: PropTypes.func,
}
FlagNotification.defaultProps = {
  isVisible: true,
  flagType: "info",
  message: "Notice Given",
  flagTime: 8,
  onFlagEnd: function() {},
}

export default FlagNotification
