import React, { Component } from "react"
import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"
import cancelIcon from './icons/cancel_Icon.svg'
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
  flagTime: PropTypes.number,  Sets how long to display the flag for in milliseconds. The default is 5
  onVisibilityEnd: PropTypes.func, This a function that is called at the end of the notification animation.
*/
class FlagNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flagColor: "#000",
      iconUrl: infoLogo,
      photoSize: 12,
      fadedIn: false,
      alertColor: "rgba(240, 173, 78,1.0)",
      successColor: "rgba(92, 184, 92,1.0)",
      failColor: "rgba(212, 63, 58,1.0)",
      infoColor: "rgba(46,109,255,1)",
      isFlagVisible:true,
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
  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  
  setVisibility = () => {
    this.setState({
      fadedIn: false,
      isFlagVisible:false,
    }, () =>{
//console.log("About to fire FlagEnd!")
        this.props.onFlagEnd()
      })
     
    
  }

  setFadedIn = () => {
    var time = 0;
    if(this.props.flagTime){
     time =  this.props.flagTime * 500
    }else{
     time =  6 * 500

    }
    this.timer=setTimeout(
      function() {
        if(this.state.fadedIn!==true&&this.props.isVisible===true){
          this.setState({
            fadedIn: true,
          })
        }
       
      }.bind(this),
      time
    )
  }

  setFlagInfo = props => {
    if ("info".match(props.flagType) || "Info".match(props.flagType)) {
      this.setFlagParams(this.state.infoColor, infoLogo, this.state.photoSize)
    } else if ("alert".match(props.flagType) || "Alert".match(props.flagType)) {
      this.setFlagParams(this.state.alertColor, alertLogo, this.state.photoSize)
    } else if (
      "success".match(props.flagType) ||
      "Success".match(props.flagType)
    ) {
      this.setFlagParams(this.state.successColor, successLogo, this.state.photoSize)
    } else if ("fail".match(props.flagType) || "Fail".match(props.flagType)) {
      this.setFlagParams(this.state.failColor, failedLogo, this.state.photoSize)
    } else {
      this.setFlagParams(this.state.infoColor, infoLogo, this.state.photoSize) //This is the default flag
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
      return this.state.isFlagVisible
        ? 
            !this.state.fadedIn ? (
              <FlagContainer
                className="show"
                onAnimationEnd={this.setFadedIn}
               borderColor=  {this.state.flagColor}
                onClick={this.handleFlagClick}
              >
                <Col>
                

                  <MessageText>{this.props.message}</MessageText>
                  <AlertImg
                    src={cancelIcon}
                    width={this.state.photoSize}
                    height={this.state.photoSize}
                    alt="status logo"
                  />
                </Col>
              </FlagContainer>
            ) : (
              <FlagContainer
                onAnimationEnd={this.setVisibility}
                className="hide"
                borderColor=  {this.state.flagColor}

              >
                <Col>
                 

                  <MessageText>{this.props.message}</MessageText>
                  <AlertImg
                    src={cancelIcon}
                    width={this.state.photoSize}
                    height={this.state.photoSize}
                    alt="status logo"
                  />
                </Col>
              </FlagContainer>
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
  transform:  translateX(100%) ;
 
} 
to {
  transform:  translateX(0%);
opacity: 1.0;
}
`
const FadeOut = keyframes`
from {
  transform:  translateX(0%) ;
  opacity: 1.0;
} 
to {
  transform:  translateX(100%) ;
  opacity: 0;
  
}
`

const MessageText = styled.span`
line-height:1.2em;
  font-size:0.9em;
  align-self:center;
  margin-right:auto;
  font-weight:400;
`
const FlagContainer = styled.div`
  /* Fonts */
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: rgba(27,27,27,1);

  /* Visibility and Opacity */
  visibility: hidden;
  z-index: 999999 ;
  width:300px;
  /* Appearence */
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.15);
  margin: 8px 0px;
  padding: 12px 10px;
  border-radius: 1px;
  border-left: 4px solid ${ props => (props.borderColor?  props.borderColor : `rgb(255,255,255)`) };
  background:white;
  overflow:hidden;


  /* Item Alignment */
  will-change: translate, opacity;
  transition: width 0.3s ease-out, top 0.4s  ease-out,bottom 0.3s  ease-out;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  pointer-events: all;

  /* Positioning */
  display:table;
  flex-shrink:1;
  /* Set this to margin right auto so it sits on the right of the screen */
  margin-left:auto;
  position: relative;
  z-index: 999;
  align-self:flex-start;
  cursor: pointer;
  
 
  
  &.show {
    visibility: visible;

    animation: ${FadeIn} 0.25s;
  }
  &.hide {
    visibility: visible;
    animation: ${FadeOut} 0.25s;
  }
  
 
`

const Col = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content:flex-start;
  vertical-align:baseline;
  min-height:2.2em;


`
// This is the positioning for the image itself. 
const AlertImg = styled.img`
  align-self:flex-start;
  align-content:center;
  margin-right:0em;
  transition: all 0.3s ease-out;

  :hover{
    opacity:0.3;
  }
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
  message: "",
  flagTime: 16,
  onFlagEnd: function() {},
}

export default FlagNotification
