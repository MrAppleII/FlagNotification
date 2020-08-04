import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { createID } from "./helpers/utils";
import ReactDOM from "react-dom";
import FlagManager from "./flagmanager";
import FlagMap from "./flagmapper";
import Notification from "./types/notification";
interface IProps {
  className?: string;
  position?: string;
}
const FlagContainer: React.FC<IProps> = ({ className = "", position = "" }) => {
  const [containerID] = useState(createID());
  const [activeContainer, setActiveContainer] = useState("-1");
  const [notifications, setNotifications] = useState([] as Notification[]);
  useEffect(() => {
    const handleFlagChange = (notifications: Array<Notification>): void => {
      // set what notifications there are
      setNotifications([...notifications]);
    };
    FlagManager.addChangeListener(handleFlagChange);
    FlagManager.addContainerChangeListener(handleUpdateContainerChange);
    FlagManager.updateContainerID(containerID);
    return () => {
      FlagManager.containerUnmounting(containerID);
      FlagManager.removeChangeListener(handleFlagChange);
      FlagManager.removeContainerChangeListener(handleUpdateContainerChange);
    };
  }, []);
  function handleRemoveFlag(notification: Notification): void {
    // tell the flag manager to remove this notication
    FlagManager.remove(notification);
  }

  function handleUpdateContainerChange(containerId: string): void {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      if (containerID !== containerId) {
        console.warn(
          "There are at least two flag containers mounted, flags will only be posted to last one mounted. To prevent bugs, mount only one container per active screen."
        );
      }
    }
    setActiveContainer(containerId);
  }

  return activeContainer === containerID
    ? ReactDOM.createPortal(
        <InnerContainer className={position + className}>
          <FlagMap
            notifications={notifications}
            handleFlagClose={handleRemoveFlag}
          />
        </InnerContainer>,
        document.body
      )
    : null;
};
export default FlagContainer;

const InnerContainer = styled.div`
  position: fixed;
  z-index: 999;
  min-width: 0;
  overflow-x: visible;
  overflow-y: visible;
  pointer-events: none;

  /**************** Positioning **********/
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  bottom: 20px;
  left: 50%;
  padding-top: 0px;
  &.reverse {
    flex-direction: column-reverse;
  }
  &.bottom {
    top: auto;
    bottom: 20px;
  }
  &.top {
    top: 20px;
    bottom: auto;
  }
  &.right {
    right: 2%;
    left: auto;
  }
  &.left {
    left: 2%;
    right: auto;
  }
`;
