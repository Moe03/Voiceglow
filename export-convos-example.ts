export interface GETExportConversationsItem {
	metadata: WidgetConvoModel,
	turns: V2TurnProps[]
}
export interface WidgetConvoModel {
	ID?: string,
	userID?: string,
	userName?: string,
	userEmail?: string,
	userImage?: string,
	userPhone?: string,
	userBrowser?: string,
	userProfilePic?: string,
	origin?: MessageOriginType,
	messagesNum?: number,
	interactionsNum?: number,
	ts?: number,
	tags?: string[],
	convoTimeSeconds?: number,
	firstMessageTS?: number,
	lastMessageTS?: number,
	userPlatform?: string,
	state?: 'requested_chat' | 'human-chatting' | 'ai-chatting' | 'ended_chat',
	chatAssignedTo?: string,
	lastModified?: number,
	sessionsNum?: number,
}

export interface V2ChatMessage {
	type: VF_RUNTIME_MESSAGE,
	payload: any,
	ts: string
}

export interface V2TurnProps {
	from: "bot" | "human",
	messages: V2ChatMessage[]
}

export interface GETExportConversationsItem {
	metadata: WidgetConvoModel,
	turns: V2TurnProps[]
}


export function V2TurnsToText(turns: V2TurnProps[]) {
  return turns.map(turn => {
    const from = turn.from
    const messages = turn.messages.flatMap(message => {
      if (message.type === 'text') {
        return `-${from}: ${message.payload?.feedback ? `(Positive feedback ✔️) ` : ''} ${message.payload.message || "NO_CONTENT"}`
      }
      if (message.type === 'visual') {
        return `-${from}: ${`![Image](${message.payload.image})`}`
      }
      // if message.type === 'cardV2'
      return []
    }).join('\n')
    return messages
  }).join('\n\n')
}

export function V2ConvosTurnsToCSV(convos: GETExportConversationsItem[]) {
  const headers = ['convo_id', 'timestamb', 'user_name', 'user_phone', 'channel', 'feedback', 'transcript']
  const csvRows = [headers.join(',')]

  convos.forEach((convo) => {
    const convoID = convo.metadata.ID
    const convoTs = convo.turns[0].messages[0].ts.replaceAll(`,`, ` -`)
    const userName = (convo.metadata.userName || 'unset').replaceAll(`,`, ` -`);
    const userPhone = (convo.metadata.userPhone || 'unset').replaceAll(`,`, ` -`);
    const channel = convo?.metadata?.origin || 'web-chat';
    const turns = V2TurnsToText(convo.turns).replaceAll(`\n`, " ");
    const hasPositiveFeedback = convo.turns.flatMap(turn => turn.messages).filter(message => message.payload?.feedback === true).length > 0 ? 'Positive' : convo.turns.flatMap(turn => turn.messages).filter(message => message.payload?.feedback === false).length > 0 ? "Negative" : 'unset'
    csvRows.push([convoID, convoTs, userName, userPhone, channel, hasPositiveFeedback, turns].join(','))
  })
  return csvRows.join('\n')
}

// for more info: https://docs.voiceglow.org
export function exportConversations(convo_ids: string[]){
   const conversationsRes: API_RESPONSE_BASE<GETExportConversationsItem[]> = await fetch(`${URL_REGION}/v2/agents/${selectedWidget.ID}/convos/export?convo_ids=${convo_ids.join(`,`)}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${selectedWidget?.SECRET_API_KEY}` // secret agent api key
            },
            method: "GET"
        }).then(res => res.json());
   const chatHistoryText = output === 'csv' ? V2ConvosTurnsToCSV(conversationsRes.data) : V2ConvosTurnsToText(conversationsRes?.data);
  console.log(chatHistoryText);
}

exportConversations(["test_id_1", "test_id_2"]);
