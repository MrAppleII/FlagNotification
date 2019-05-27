import React, { Component } from "react"
import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"

import successLogo from "./icons/successLogo.svg"
import alertLogo from "./icons/alertLogo.svg"
import failedLogo from "./icons/failedLogo.svg"
import infoLogo from "./icons/infoLogo.svg"
/*
  File: FlagNotification.js
  Description: Creates a small alert on the bottom left of the screen. It will stay for 8 seconds if no prop time is passed in. 
  After fading out it will call a prop function which by default does nothing. 

  Props:  
  flagType: PropTypes.string,  Sets the kind of alter to display. Can be "alert","success","info", and "fail"
  isVisible: PropTypes.bool,   Default is true. Sets if it is visible. When set to true, it will stay open for 8 seconds. 
  message: PropTypes.string,   Default is "Notice Given". It is the message that is meant to be displayed to the user. 
  flagTime: PropTypes.number,  Sets how long to display the flag for in miliseconds. The default is 8
  onVisibilityEnd: PropTypes.func, This a function that is called at the end of the notification dissapearing. Default is nothing.
*/
class FlagNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: props.isVisible,
      flagColor: "#000",
      iconUrl: infoLogo,
      photoSize: 40,
      fadedIn: false,
      flagDisplayTime: 8,
      alertColor : "rgba(240, 173, 78,0.95)",
      successColor : "rgba(92, 184, 92,0.95)",
      failColor : "rgba(212, 63, 58,0.95)",
      infoColor : "rgba(0,0,0,0.95",
    }
  }
  componentDidMount() {
    try{
      this.setFlagInfo(this.props)
      this.setState({
        flagDisplayTime:this.props.flagTime * 1000,
      })

    }catch(e){
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
        this.setFlagParams(this.state.infoColor, infoLogo, 40) //This is the default flag
      }
    }
    
  }
  componentWillUnmount() {}

  setVisibility = () => {
    this.setState({
      isVisible: false,
    })
    this.props.onVisibilityEnd();
  }

  setFadedIn = () => {
    setTimeout(
      function() {
        this.setState({
          fadedIn: true,
        })
      }.bind(this),
      this.state.flagDisplayTime
    )
  }

  setFlagInfo = props => {
    

   
    if ("info".match(props.flagType) || "Info".match(props.flagType)) {
      this.setFlagParams(this.state.infoColor, infoLogo, 40)
    } else if ("alert".match(props.flagType) || "Alert".match(props.flagType) ) {
      this.setFlagParams(this.state.alertColor, alertLogo, 40)
    } else if ("success".match(props.flagType) ||"Success".match(props.flagType) ) {
      this.setFlagParams(this.state.successColor, successLogo, 40)
    } else if ("fail".match(props.flagType) || "Fail".match(props.flagType)) {
      this.setFlagParams(this.state.failColor, failedLogo, 40)
    } else{
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

  render() {
    try {
      return this.state.isVisible ? (
        !this.state.fadedIn ? (
          <FlagContainer
            className="show"
            onAnimationEnd={this.setFadedIn}
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
        )
      ) :  null
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}

const FadeIn = keyframes`
from {
  bottom: 0; 
 opacity: 0;
} 
to {
  bottom: 24px;
opacity: 0.99;
}
`
const FadeOut = keyframes`
from {
  bottom: 24px;
  opacity: 0.99;
} 
to {
  bottom: 0; 
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
  flagTime: 7,
  onVisibilityEnd: function(){},
}

export default FlagNotification
