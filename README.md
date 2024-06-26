<img src="https://cdn.voiceglow.org/COOOOOOOOOL.png" alt="VG + VF = Magic!" width="100%"/>

# API Docs:
https://docs.voiceglow.org

## Voiceglow Docs
Make your voiceflow chatbots glow! Create an account then deploy an agent in seconds here: 
https://voiceglow.org
<br/>
Docs to programatically interact with the VG widget with JS. React package coming soon 👀 <br />
Please join our [discord](https://discord.gg/tQDD7Ap3qt) if you have any feature requests/bugs. <br />

# Quickstart:

- **Push a new message:** <br />
Used to push a message by either the human or the bot, see setRuntime section to fully control the AI agent.
```js
window.VG_ADMIN.pushMessage({
  from: 'bot',
  type: 'text',
  payload: 'Hi there from the console!'
});
```
___
- **Reload Chat:** <br />
Used to reload the chat and start a new one.
```ts
window.VG_ADMIN.reload();
```
___
- **Get Runtime Data:** <br />
Used to get the runtime which contains the chatHistory, userID, and much more, try it out yourself!
```ts
const vgRuntime = window.VG_ADMIN.getRuntimeData();
```
___
- **Set Runtime Data:** <br />
Used typically now to fully control the conversation, see first usecase at the bottom for more context.
```ts
window.VG_ADMIN.setRuntime({
  manualControl: true,
  agentName: 'Atoot'
})
```
___

- **Events:** <br />
  All your agent's events are handled through "VG_Events" custom event.
```ts

function customEventHandler(e: CustomEvent<VGCustomEvent>){
    interface VGCustomEvent<d = any> {
      event: "new_turn" | "new_message" | 'chat_open' | 'chat_close' | 'chat_restart',
      data: d,
      ts?: number
    }
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

## Interact with webhooks (Continue conversations NOT initiating them):
To interact with your user on the widget you need 3 things: 
- Your widget region (account region on VG) <br />
  **North America Server: https://na-runtime.voiceglow.org'** <br />
  **Europe Server: https://eu-voiceglow-runtime-vbmbkqccuq-ey.a.run.app** <br />
- AgentID on Voiceglow
- UserID of the user to inteact with

#### Send a message from the bot/human (Without Interacting):
```ts
// Adjust VF variables, append messages to be viewed
// This following is used if you only want to show messages to the user, and not interact with the VF agent.
fetch(`https://na-runtime.voiceglow.org/vg/${agentID}/vf/interact/${userID}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "variables": {
            "user_name": "Mr Atoot"
        },
        "appendMessages": [
            {
                "from": "bot",
                "type": "text",
                "item": {
                    "payload": {
                        "message": "Did you know that the strongest muscle in the body is the tongue!"
                    }
                },
                "delay": 0
            }
        ]
    })
})
```
___
#### Send a message as the user (With interacting);
- Please note this use case is typically used with stringifying a JSON object for example and masking it on the user's side, we provide an easy way to do it for you through a message type called "info:success" | "info:primary" | "info:danger" | "info:default" where that will mask the action message with the correspoding event color, if you're interacting on behalf of the user it may become confusing for them, that's why we recommend having a different looking message that appears in the UI if you interact on their behalf.
```ts
fetch(`https://na-runtime.voiceglow.org/vg/${agentID}/vf/interact/${userID}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "variables": {
            "user_name": "Mr Atoot"
        },
        "appendMessages": [
            {
                "from": "bot",
                "type": "info:default",
                "item": "Will execute query: Hi there!",
                "delay": 0
            }
        ],
        "action": {
            "type": "text",
            "payload": "Hi there!"
        }
    })
})
```
___
## Use case 1: <br/>
Full control over the chat:
```ts
window.VG_ADMIN.setRuntime({
  agentName: "Atoot", // any string, better to be a one word name.
  manualControl: true // this will disable the AI, VF API and let you have full control over the chat.
})
```
___
Now lets try it out, try the following in the console after the previous script:
```ts
window.VG_ADMIN.pushMessage({
  from: 'bot',
  type: 'text',
  payload: 'Hi, its Atoot from the console!'
})
```
```ts
window.VG_ADMIN.pushMessage({
  from: 'human',
  type: 'text',
  payload: 'Hey Attot, its Moe how are you doing?'
})
```
```ts
window.VG_ADMIN.pushMessage({
  from: 'bot',
  type: 'text',
  payload: 'im good man that tuna yesterday was craaaazy'
})
```
```ts
window.VG_ADMIN.pushMessage({
  from: 'human',
  type: 'text',
  payload: 'haha, got some treats for you today!'
})
```
```ts
window.VG_ADMIN.pushMessage({
  from: 'bot',
  type: 'text',
  payload: 'YOO THATS LIT!!'
})
```
You can use the previous with whatever API like intercom and have VG as the interface for your chat, then simply set the settings back to the default when you're finished, that will make the AI to take over the convo again, also don't forget to remove/replace the agentName:
```ts
window.VG_ADMIN.setRuntime({
  agentName: "", // any string, better to be a one word name.
  manualControl: false // this will disable the AI, VF API and let you have full control over the chat.
})
```
___
## Use case 2: <br/>
Recording the chathistory with a custom integration:

```ts
interface VGCustomEvent<d = any> {
  event: "new_turn" | "new_message" | 'chat_open' | 'chat_close' | 'chat_restart',
  data: d,
  ts?: number
}

function customEventHandler(e: CustomEvent<VGCustomEvent>){

      const eventType = e.detail.event; // can be: 'new_turn' | 'new_message' | 'chat_open' | 'chat_close' | 'chat_restart'

      if (eventType === 'new_turn') {
        // new turn was added, this is specifically triggered when a new response was received from VF API
        if (eventType === 'new_turn') {
            // new turn was added, this is specifically triggered when a new response was received from VF API
            const newTurn = e.detail.data.newTurn;
            const newTurnsArray = e.detail.data.turns;
            console.log('The New Turn: ', newTurn)
            console.log('Entire turns Array: ', newTurnsArray);

            // now save the new array automatically on your preferred storage..
          }
      }
    }

document.addEventListener('VG_Events', customEventHandler);
```
___
### Full API: <br />
Warning: Boring stuff

- Change agent options from script:
```ts
interface VGConfig {
    ID?: string;
    stylesheets?: string[];
    render?: 'popup' | 'full-width';
    region?: 'eu' | 'na',
    userID?: string,
    autostart?: boolean,
    pushMessage?: (message: string) => void;
    getRuntimeData?: () => any,
    variables?: ChatRuntime
}

window.VG_CONFIG = {
    ID?: string;
    stylesheets?: string[];
    render?: 'popup' | 'full-width';
    region?: 'eu' | 'na',
    userID?: string,
    autostart?: boolean,
    pushMessage?: (message: string) => void;
    getRuntimeData?: () => any,
    variables?: {
        theme?: string;
        title?: string;
        description?: string;
        roundedImageURL?: string;
        rectangeImageURL?: string;
        messageDelayMS?: number;
        scrollAnimation?: boolean;
        proactiveMessage?: string;
        acceptFileUpload?: boolean;
        recordChatHistory?: boolean;
        chatBgURL?: string;
        disableSmoothScroll?: boolean;
        ownerID?: string;
        isDeployed?: boolean;
        tokensUsage?: any;
        maxTokensUsage?: any;
        lastModified?: number;
        fontFamily?: string;
        branding?: string;
        customThemeJSONString?: string;
        autoStartWidget?: boolean;
        allTimeTriggers?: number;
        syncBrowser?: boolean;
        delayBeforeSubmit?: number;
        region?: 'voiceglow-eu' | '(default)',
        listenForUrlChanges?: boolean,
        chatForget?: boolean,
        lang?: string,
        customButtonJSON_STRING?: string,
        enableAudioSupport?: boolean,
        AITranslateTo?: string;
        enableAITranslate?: boolean;
    },
    vf_variables: object // set VF variables on initial request
} as VGConfig
```
- Push Message API:
```ts
 interface PushMessageInterface {
    from: 'human' | 'bot',
    type: 'text',
    payload?: string,
    delay?: number
  }
window.VG_ADMIN.pushMessage(PushMessageInterface)
```
___
- Reload Chat API:
```ts
// soon you'd be able to set a custom userID
window.VG_ADMIN.reload();
```
___
- Get Runtime Data API:
```ts
/**
 * Represents the runtime configuration for the chat system.
 * @interface RuntimeInterface
 */
export interface RuntimeInterface {
  /**
   * The user ID associated with the runtime.
   * @type {string | undefined}
   */
  userID?: string;

  /**
   * Indicates whether the chat system is currently loading.
   * @type {boolean | undefined}
   */
  loading?: boolean;

  /**
   * An array of chat messages representing the chat history.
   * @type {ChatMessage[] | undefined}
   */
  chatHistory?: ChatMessage[];

  /**
   * The last response received from the chat system.
   * @type {any | undefined}
   */
  lastResponse?: any;

  /**
   * The delay for displaying the default message.
   * @type {number | undefined}
   */
  defaultMessageDelay?: number;

  /**
   * Variables related to the chat runtime.
   * @type {ChatRuntime | undefined}
   */
  variables?: ChatRuntime;

  /**
   * Indicates whether a reload is requested.
   * @type {boolean | undefined}
   */
  reload?: boolean;

  /**
   * Notice information for displaying messages.
   * @type {{
   *   active?: boolean,
   *   message?: string,
   *   duration?: number,
   *   type?: 'success' | 'fail'
   * } | undefined}
   */
  notice?: {
    active?: boolean;
    message?: string;
    duration?: number;
    type?: 'success' | 'fail';
  };

  /**
   * Indicates whether input should be blocked.
   * @type {boolean | undefined}
   */
  blockInput?: boolean;

  /**
   * Indicates whether browser synchronization is required.
   * @type {boolean | undefined}
   */
  shouldSyncBrowser?: boolean;

  /**
   * The response queue for managing responses.
   * @type {any | undefined}
   */
  responseQ?: any;

  /**
   * Indicates whether loading should be blocked.
   * @type {boolean | undefined}
   */
  blockLoading?: boolean;

  /**
   * Indicates whether proactive actions should be blocked.
   * @type {boolean | undefined}
   */
  blockProactive?: boolean;

  /**
   * Indicates whether all actions should be blocked.
   * @type {boolean | undefined}
   */
  blockAll?: boolean;

  /**
   * Indicates whether initialization statistics are available.
   * @type {boolean | undefined}
   */
  hasInitStats?: boolean;

  /**
   * Metadata related to the conversation widget.
   * @type {{
   *   convo?: WidgetConvoModel
   * } | undefined}
   */
  metadata?: {
    convo?: WidgetConvoModel;
  };

  /**
   * Indicates whether manual control is enabled.
   * @type {boolean | undefined}
   */
  manualControl?: boolean;

  /**
   * The name of the chat agent.
   * @type {string | undefined}
   */
  agentName?: string;
}

const RuntimeInterface = window.getRuntime();
```
___
- Events API:
```ts
function customEventHandler(e: CustomEvent<VGCustomEvent>) {

    const eventType = e.detail.event; // can be: 'new_turn' | 'new_message' | 'chat_open' | 'chat_close' | 'chat_restart'

    if (eventType === 'new_turn') {
        const eventData: {
            turns: TurnProps[],
            newTurn: TurnProps
        } = e.detail.data;
        console.log(eventData)
    }
    if (eventType === 'new_message') {
        // new message was added, this is triggered when a new message was added and is visible to the user.
        const eventData: {
            from: 'human' | 'bot'
            type: 'text' | 'jsx' | 'carousel' | 'card' | 'visual' | 'FileUpload' | 'buttons' | 'VGVF_Channel' | 'no-reply' | string
            content: any,
            ts?: number
        } = e.detail.data;
        console.log(eventData)
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
