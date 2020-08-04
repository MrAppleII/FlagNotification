# ReactFlagNotification
It is a flag notification that shows up in the bottom left side of the screen. It comes with royalty free icons. 

# Flag Container Props 
The flag container can take a few props to change the position of the flags as well as other styling. 
| Prop  | DEFAULTS |
| --- | --- | 
|className?: string, | Pass in a classname if you'd like to further customize the container using css classes.|
|position?: string,  | By default the container is in the center. You can set it to different positions using combinations like "top right" or "bottom left". It accepts "top", "bottom", "right", "left".| 
|style?: React.CSSProperties,   | If you would like to customize the container using style objects just pass it in as a prop. |

# FlagManager
The flag manager apart from calling flags can be customized in a few ways. 
| Method Name | Description | 
| --- | --- | 
| setDefaultFlagTime | You can pass in a number to set the time for flags to stay on screen  |
| setMaxNotifications | Pass in the max number of notifications you want to display at a time. | 


# Example Usage 
To properly use it, insert the FlagContainer in a commonly used location such as a Layout component. Only use one container at a time to 
prevent bugs. If there are more than two at a time it will warn you in the console as a heads up. 
```javascript
import {FlagContainer,FlagManager} from 'components/general/flagnotification/'
 const Layout = ({children}) =>(
   <BodyLayout>
    <PageContent>{children}</PageContent>
    <FlagContainer
   </BodyLayout>
 )
```
Then use the FlagManager to call flags and set things like the default time for the flags and how many can be shown at once. 
```javascript
import {FlagManager} from 'components/general/flagnotification'
const MyPage = () =>(
 <Layout>
  <h1>Click on this button to call a flag!</h1>
  <button onClick={()=>{
   FlagManager.info("Hello!","Here is a flag!")
  }}>
  Summon Flag!
  </button>
 </Layout>
)
```
