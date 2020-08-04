import { EventEmitter } from "events";
import { createID } from "./helpers/utils";
import Notification from "./types/notification";
interface flagCall {
  generalFlagCall: (
    message: string,
    detail?: string,
    flagTime?: number
  ) => void;
  info: flagCall["generalFlagCall"];
  alert: flagCall["generalFlagCall"];
  success: flagCall["generalFlagCall"];
  fail: flagCall["generalFlagCall"];
}
const FlagTypes = {
  ALERT: "alert",
  SUCCESS: "success",
  FAIL: "fail",
  INFO: "info",
  CHANGE: "change",
};
/**
 * @name FlagManager
 * @description Used to summmon flags declaritvely.
 */
const FlagManager = (function () {
  let _currentContainerID: string;
  let _notificationList: Array<Notification>;
  let _maxSize: number;
  let _defaultFlagTime: number;

  class FlagManager extends EventEmitter {
    constructor() {
      super();
      // Lets set our defaults.
      _maxSize = 7;
      _defaultFlagTime = 3;
      _currentContainerID = createID();
      _notificationList = [];
    }
    /**
     * @function setDefaultFlagTime This number is used for flags that do not
     * have a flag time when called.
     * @param {number} flagTime
     */
    set setDefaultFlagTime(flagTime: number) {
      _defaultFlagTime = flagTime;
    }
    /**
     * @function getDefaultFlagTime
     * @returns {number} Returns the number currently set as the flag time
     */
    get getDefaultFlagTime(): number {
      return _defaultFlagTime;
    }
    /**
     * @function setMaxNotifications Sets how many notifications can be shown
     * at the once.
     * @param {number} maxSize
     */
    setMaxNotifications(maxSize: number): void {
      _maxSize = maxSize;
    }
    /**
     * @function getMaxNotications Returns what is the current max amount of notifications
     * @returns {number} maxSize
     */
    getMaxNotications(): number {
      return _maxSize;
    }
    createFlag(notification: Notification) {
      const maxSize = 7;
      if (_notificationList.length === maxSize) {
        //First pop one
        _notificationList.shift();
      }
      _notificationList.push(notification);
      this.emitChange();
    }
    /**
     * @function info Creates an info type flag to be displayed
     * @param message This is the main message to be shown to the user
     * @param detail Sets the detail text
     * @param flagTime Sets the flag time for the flag.
     */
    info: flagCall["info"] = (
      message,
      detail = "",
      flagTime = _defaultFlagTime
    ) => {
      const type = "info";
      const id = createID(); // Make a generic ID for the Flag
      this.createFlag({
        id,
        type,
        message,
        detail,
        flagTime,
      });
    };
    /**
     * @function success Creates an success type flag to be displayed
     * @param message This is the main message to be shown to the user
     * @param detail Sets the detail text
     * @param flagTime Sets the flag time for the flag.
     */
    success: flagCall["success"] = (
      message,
      detail = "",
      flagTime = _defaultFlagTime
    ) => {
      const type = "success";
      const id = createID(); // Make a generic ID for the Flag

      this.createFlag({
        id,
        type,
        message,
        detail,
        flagTime,
      });
    };
    /**
     * @function fail Creates an fail type flag to be displayed
     * @param message This is the main message to be shown to the user
     * @param detail Sets the detail text
     * @param flagTime Sets the flag time for the flag.
     */
    fail: flagCall["fail"] = (
      message,
      detail = "",
      flagTime = _defaultFlagTime
    ) => {
      const type = "fail";
      const id = createID(); // Make a generic ID for the Flag

      this.createFlag({
        id,
        type,
        message,
        detail,
        flagTime,
      });
    };
    /**
     * @function alert Creates an alert type flag to be displayed
     * @param message This is the main message to be shown to the user
     * @param detail Sets the detail text
     * @param flagTime Sets the flag time for the flag.
     */
    alert: flagCall["alert"] = (
      message,
      detail = "",
      flagTime = _defaultFlagTime
    ) => {
      const type = "alert";
      const id = createID(); // Make a generic ID for the Flag

      this.createFlag({
        id,
        type,
        message,
        detail,
        flagTime,
      });
    };
    /**
     * @funcion clearCache
     * @description Clears the current list of notifications
     */
    clearCache() {
      _notificationList = [];
      this.emitChange();
    }
    remove(notification: Notification) {
      _notificationList = _notificationList.filter(
        n => notification.id !== n.id
      );
      this.emitChange();
    }

    emitChange() {
      this.emit(FlagTypes.CHANGE, _notificationList);
    }

    addChangeListener(callback: (notifications: Array<Notification>) => void) {
      this.addListener(FlagTypes.CHANGE, callback);
    }
    addContainerChangeListener(callback: (containerId: string) => void) {
      this.addListener("updateContainerId", callback);
    }

    removeChangeListener(
      callback: (notifications: Array<Notification>) => void
    ) {
      this.removeListener(FlagTypes.CHANGE, callback);
    }
    removeContainerChangeListener(callback: (containerId: string) => void) {
      this.removeListener("updateContainerId", callback);
    }
    containerUnmounting(containerID: string) {
      if (containerID === _currentContainerID) {
        this.clearCache();
      }
    }
    /*
    This updates the latest container id and emits to the containers
    to prevent duplicate flags from showing up.
  */
    emitContainerIdUpdate() {
      this.emit("updateContainerId", _currentContainerID);
    }
    updateContainerID(containerID: string) {
      /*
      Update the ID of the current container.
      If there are multiple container, we will only push to the last
      one created. 
    */
      _currentContainerID = containerID;
      this.emitContainerIdUpdate();
      /*
      We should clear the cache now, this prevents duplicate flags.
    */
      this.clearCache();
    }
  }

  return new FlagManager();
})();
export default FlagManager;
