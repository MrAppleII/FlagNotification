# ReactFlagNotification
It is a flag notification that shows up in the bottom left side of the screen. It comes with royalty free icons. 

# Props 

| Prop  | DEFAULTS |
| --- | --- | 
|flagType: PropTypes.string,  | Sets the kind of alter to display. Can be "alert","success","info", and "fail"|
|isVisible: PropTypes.bool,   | Default is true. Sets if it is visible. When set to true, it will stay open for 8 seconds.| 
|message: PropTypes.string,   | Default is "Notice Given". It is the message that is meant to be displayed to the user. |
|flagTime: PropTypes.number,  | Sets how long to display the flag for in miliseconds. The default is 8 |
|onVisibilityEnd: PropTypes.func, | This a function that is called at the end of the notification dissapearing. Default is nothing.|
