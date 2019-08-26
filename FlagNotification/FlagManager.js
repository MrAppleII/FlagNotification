import { EventEmitter } from "events"
const createID = () => {
  const pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
  return pattern.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
const FlagTypes = {
  ALERT: "alert",
  SUCCESS: "success",
  FAIL: "fail",
  INFO: "info",
  CHANGE: "change",
}
class FlagManager extends EventEmitter {
  constructor(props) {
    super(props)
    this.currentContainerID = -1
    this.notificationList = []
  }

  componentDidMount() {}
  componentWillUnmount() {}

  createFlag(notification) {
    const defaultNotify = {
      id: createID(), // Make a generic ID for the Flag
    }
    var maxSize = 7
    if(this.notificationList.length===maxSize){
      //First pop one
      this.notificationList.shift()

    }

    this.notificationList.push(Object.assign(defaultNotify, notification))
    this.emitChange()
  }
  info(message, flagTime) {
    this.createFlag({
      type: FlagTypes.INFO,
      message,
      flagTime,
    })
  }
  success(message, flagTime) {
    this.createFlag({
      type: FlagTypes.SUCCESS,
      message,
      flagTime,
    })
  }
  fail(message, flagTime) {
    this.createFlag({
      type: FlagTypes.FAIL,
      message,
      flagTime,
    })
  }
  alert(message, flagTime) {
    this.createFlag({
      type: FlagTypes.ALERT,
      message,
      flagTime,
    })
  }
  clearCache() {
    this.notificationList = []
    this.emitChange()
  }
  remove(notification) {
    this.notificationList = this.notificationList.filter(
      n => notification.id !== n.id
    )
    this.emitChange()
  }

  emitChange() {
    this.emit(FlagTypes.CHANGE, this.notificationList)
  }

  addChangeListener(callback) {
    this.addListener(FlagTypes.CHANGE, callback)

  }
  addContainerChangeListener(callback){
    this.addListener('updateContainerId', callback)
  }

  removeChangeListener(callback) {
    this.removeListener(FlagTypes.CHANGE, callback)
  }
  removeContainerChangeListener(callback){
    this.removeListener('updateContainerId', callback)

  }
  containerUnmounting(containerID){
    if(containerID===this.currentContainerID){
      this.clearCache()
    }
  }
  /*
    This updates the latest container id and emits to the containers
    to prevent duplicate flags from showing up.
  */
  emitContainerIdUpdate(){
    this.emit('updateContainerId',this.currentContainerID)
  }
  updateContainerID(containerID){
    /*
      Update the ID of the current container.
      If there are multiple container, we will only push to the last
      one created. 
    */
    this.currentContainerID = containerID
    this.emitContainerIdUpdate()
    /*
      We should clear the cache now, this prevents duplicate flags.
    */
   this.clearCache()
   
  }
}
export default new FlagManager()
