
interface EWSInteractModel {
    agentId: string,
    convoId: string,
    bucket: "voiceglow-eu" | '(default)', // (default) is na region.
    prompt?: string, // question for the ai
    disableUiEngine?: boolean, // force disable ui engine
    disableRecordHistory?: boolean, // force disable record history
    agentData?: ChatRuntime, // optional replace agent variables on request
}

export interface EWSChunkModel {
    type: 'chunk' | 'metadata',
    chunk: string,
    chunkIndex: number,
    ui_engine?: boolean,
    metadata?: EWSChunkMetadataModel
}

const ws = new WebSocket(`wss://vg-ws-edge.moeaymandev.workers.dev/ws`); //REPLACE WITH LIVE ONE..

ws.onopen = () => {
  
    const interactObject: EWSInteractModel = {
        agentId: "v72km4duyj1v4xg",
        convoId: "anything_idk",
        bucket: "voiceglow-eu", // can be either "voiceglow-eu" or "(default)" -> NA region
        prompt: "Hi!!",
    };

    // init interact
    ws.send(JSON.stringify(interactObject));
};

// listen for the stream
ws.onmessage = (event) => {
  
    const eventData: EWSChunkModel = JSON.parse(event.data);
  
    if (eventData.type === "chunk") {
        console.log(`UIEngineEnabled: ${eventData.ui_engine} | Chunk: ${eventData.chunk}`)
        console.log(eventData.chunk)
    }
  
    if (eventData.type === 'metadata') {
        console.log("metadata chunk");
        console.log(eventData.metadata);
        return;
    }
  
};
