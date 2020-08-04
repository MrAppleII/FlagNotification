import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import CancelIcon from "./icons/cancelicon";
import Notification from "./types/notification";
interface FlagNotificationProps extends Notification {
  iconSize?: number;
  onFlagEnd?: (notification?: Notification) => void;
  flagColor?: string;
}
/**
 * @name FlagNotification
 * @type React.FC
 * @description Creates a small alert on the bottom left of the screen. It will stay for 5 seconds if no prop time is passed in.
 * After fading in and the timer running out, it will call a prop function which by default does nothing. At the
 * end you can set the flag visibility to false hide the flag.
 * @prop {string} type Sets the flag type, can be set to "alert", "success", "info", and "fail"
 * @prop {string} message This is the message that will displayed to the user.
 * @prop {string} detail This will be displayed below the message.
 * @prop {number} flagTime This sets how long the flag will be displayed.
 * @prop {void} onVisibilityEnd This function is called after the flag is done being displayed.
 *
 */
const FlagNotification: React.FC<FlagNotificationProps> = ({
  iconSize = 12,
  flagTime = 3,
  onFlagEnd = function () {
    // This is done just to make sure its of void type
  },
  flagColor = "rgba(61,160,255,1)",
  message = "",
  detail = "",
}) => {
  const [flagVisible, setFlagVisible] = useState(true);
  const [inDOM, setInDOM] = useState(true);
  useEffect(() => {
    if (!inDOM) {
      onFlagEnd();
    }
  }, [inDOM]);
  function endFlagVisibility() {
    setInDOM(false);
  }
  function hideFlag() {
    setFlagVisible(false);
  }
  function setFadedIn(event: React.AnimationEvent) {
    event.persist();
    event.preventDefault();
    const animationName = event.animationName;
    if (animationName === StayDisplayed.getName()) {
      hideFlag();
    }
  }
  return inDOM ? (
    <FlagContainer
      displayTime={flagTime}
      className={flagVisible ? "show" : "hide"}
      onAnimationEnd={flagVisible ? setFadedIn : endFlagVisibility}
      backgroundColor={flagColor}
      onClick={hideFlag}
    >
      <FlexRow>
        <FlexCol>
          <FlagMessage className="flagMessage">{message}</FlagMessage>
          <FlagDetail className="flagDetail">{detail}</FlagDetail>
        </FlexCol>

        <CloseButton width={iconSize} height={iconSize} />
      </FlexRow>
    </FlagContainer>
  ) : null;
};
// Animation definitions
const FadeIn = keyframes`
0% {
  opacity: 0;
  transform: scale(0.5) translateY(100%) ;
 
} 

100% {
  transform: scale(1)  translateY(0%);
opacity: 1.0;
}
`;
const StayDisplayed = keyframes`
0% {
  transform: scale(1)  translateY(0%);
opacity: 1.0;
}
100% {
  transform: scale(1)  translateY(0%);
opacity: 1.0;
}
`;
const FadeOut = keyframes`
from {
  transform:  translateY(0%) ;
  opacity: 1.0;
} 
to {
  transform:  translateY(100%) ;
  opacity: 0;
  
}
`;

const FlagMessage = styled.span`
  font-size: 0.92em;
  align-self: center;
  margin-right: auto;
  font-weight: 500;
`;
const FlagContainer = styled.div<{
  displayTime?: number;
  backgroundColor?: string;
}>`
  /* Fonts */
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;

  color: rgba(255, 255, 255, 1);
  font-size: 1em;
  /* Visibility and Opacity */
  visibility: hidden;
  z-index: 999;
  width: 400px;
  /* Appearence */
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  margin: 8px 0px;
  margin-left: -200px;
  padding: 8px 10px;
  border-radius: 6px;
  background: ${props =>
    props.backgroundColor ? props.backgroundColor : `rgb(255,255,255)`};
  overflow: hidden;

  /* Item Alignment */
  transition: width 0.3s ease-out, top 0.4s ease-out, bottom 0.3s ease-out;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  pointer-events: all;

  /* Positioning */
  display: table;
  flex-shrink: 1;
  /* Set this to margin right auto so it sits on the right of the screen */

  position: relative;
  z-index: 999;
  align-self: flex-start;
  cursor: pointer;

  &.show {
    visibility: visible;
    /* @keyframes duration | timing-function | delay | 
iteration-count | direction | fill-mode | play-state | name */
    animation: 0.2s ease 0s forwards ${FadeIn},
      ${props => props.displayTime + `s`} ease 0.2s forwards ${StayDisplayed};
  }
  &.hide {
    visibility: visible;
    animation: ${FadeOut} 0.25s forwards;
  }
`;
const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
`;
const FlagDetail = styled.span`
  font-weight: 300;
  font-size: 0.8em;
  margin-top: 2px;
`;

const FlexRow = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  vertical-align: baseline;
  min-height: 45px;
`;

// This is the positioning for the image itself.
const CloseButton = styled(CancelIcon)`
  align-self: center;
  align-content: center;
  margin-right: 0em;
  transition: all 0.2s ease-out;
  opacity: 1;
  &:hover {
    opacity: 0.3;
  }
`;

export default FlagNotification;
