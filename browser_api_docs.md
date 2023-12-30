**JS Docs to programatically interact with the VG widget. **

- **Push a new message:**
```js
window.VG_ADMIN.pushMessage("Hi from the console!");
```
- **Reload Chat:**
```ts
window.VG_ADMIN.reload();
```
- **Get Runtime Data:**
Used to get the runtime which contains the chatHistory, userID, and much more
```ts
const vgRuntime = window.VG_ADMIN.getRuntimeData();
```
- **Events:**
```ts
interface VGCustomEvent<d = any> {
  event: "new_turn" | "new_message" | 'chat_open' | 'chat_close' | 'chat_restart',
  data: d,
  ts?: number
}

interface CustomEventInner<d = any> {
  event: 'new_turn' | 'new_message' | 'chat_open' | 'chat_close' | 'chat_restart', // types of the events
  data: d,
  ts?: number // timestamb of the event.
}

function customEventHandler(e: CustomEvent<VGCustomEvent>){

      const eventType = e.detail.event; // can be: 'new_turn' | 'new_message' | 'chat_open' | 'chat_close' | 'chat_restart'

      if (eventType === 'new_turn') {
        // new turn was added, this is specifically triggered when a new response was received from VF API
        console.log(e.detail.data) // logs the new turn that was added and the full turns array
      }
      if (eventType === 'new_message') {
        // new message was added, this is triggered when a new message was added and is visible to the user.
        console.log(e.detail.data)
      }
      if (eventType === 'chat_open') {
        // user has opened the chatbox, works only if render is set to 'popup'
        console.log('You opened the Chatbox.')
      }
      if (eventType === 'chat_close') {
        // user has closed the chatbox, works only if render is set to 'popup'
        console.log('You closed the Chatbox.')
      }
      if (eventType === 'chat_restart') {
        // user has restarted the chat, works only if render is set to 'popup'
        console.log('You restarted the Chatbox.')
      }
    }

document.addEventListener('VG_Events', customEventHandler);
```
