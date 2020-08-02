import React, { Component } from "react"
import PropTypes from "prop-types"
import Flag from './FlagNotification'
import styled from "styled-components"
/*
  File: FlagMapper.js
  Description: Creates an array of JSX FlagContainer to be displayed.
  It uses the unique ID generated for the keys in the array. These are 
  displayed in the corner. When a flag is closed, the prop function
  "handleFlagClose" is called.
  */
class FlagMapper extends Component {
    constructor(props) {
      super(props)
      this.state = {

    }
}
handleFlagClose = notification => () => {
  
    this.props.handleFlagClose(notification);
   
  }

render() {
    try {
      return (
      <Container>
          {this.props.notifications.map((notification) => {
            return (
              <Flag
                key={notification.id}
                detail={notification.detail}
                flagType={notification.type}
                message={notification.message}
                flagTime={notification.flagTime}
                onFlagEnd={this.handleFlagClose(notification)}
              />
            );
          })}
      </Container>
      ) 
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
FlagMapper.propTypes = {
    notifications: PropTypes.array.isRequired,
    handleFlagClose:PropTypes.func,
}
FlagMapper.defaultProps = {
    handleFlagClose: function(){},
    notifications :[],
}
const Container  = styled.div`
transition-duration:2s;
transition-property:all;
z-index: 999;
display:flex;
flex-direction:column;



`
export default FlagMapper