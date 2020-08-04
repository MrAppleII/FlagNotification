import React from "react";
import Flag from "./flagnotification";
import styled from "styled-components";
import Notification from "./types/notification";
interface FlagMappperProps {
  notifications?: Array<Notification>;
  handleFlagClose?: (notification: Notification) => void;
}
/**
 * @name FlagMapper
 * @description Returns an array of Flags that are goind to be displayed.
 * @param {Notification[]} notifications
 * @param {void} handleFlagClose This is the function that will be called when a flag is closed.
 * @returns ReactNode
 */
const FlagMapper: React.FC<FlagMappperProps> = ({
  notifications = [],
  handleFlagClose = function () {
    // This is just put in to make sure a function is called and not a non function
  },
}) => {
  const alertColor = "rgba(240, 173, 78,1.0)";
  const successColor = "rgba(92, 184, 92,1.0)";
  const failColor = "rgba(212, 63, 58,1.0)";
  const infoColor = "rgba(61,160,255,1)";

  function getFlagColor(flagType: Notification["type"]) {
    if (!flagType || typeof flagType !== "string") {
      return infoColor;
    }
    switch (flagType) {
      case "info":
        return infoColor;

      case "alert":
        return alertColor;

      case "success":
        return successColor;

      case "fail":
        return failColor;

      default:
        return infoColor;
    }
  }
  const Flags = notifications.map(notification => {
    const flagColor = getFlagColor(notification.type);
    return (
      <Flag
        id={notification.id}
        key={notification.id}
        detail={notification.detail}
        type={notification.type}
        flagColor={flagColor}
        message={notification.message}
        flagTime={notification.flagTime}
        onFlagEnd={() => {
          handleFlagClose(notification);
        }}
      />
    );
  });
  return <Container>{Flags}</Container>;
};

const Container = styled.div`
  transition-duration: 2s;
  transition-property: all;
  z-index: 999;
  display: flex;
  flex-direction: column;
`;
export default FlagMapper;
