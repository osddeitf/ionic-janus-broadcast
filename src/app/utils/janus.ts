

interface JanusInitOptions {
  debug?: boolean | "all" | ("trace"| "debug"| "log"| "warn"| "error")[];
  dependencies?: any,
  callback?: () => any
}

interface JanusOptions {
  /** the address of the server as a specific address (e.g., http://yourserver:8088/janus to use the plain HTTP API or ws://yourserver:8188/ for WebSockets) or as an array of addresses to try sequentially to allow automatic for fallback/failover during setup; */
  server: string
  /** a list of STUN/TURN servers to use (a default STUN server will be used if you skip this property); */
  iceServers?: string[]
  /** whether IPv6 candidates should be gathered or not; */
  ipv6?: boolean
  /** whether the withCredentials property of XHR requests should be enabled or not (false by default, and only valid when using HTTP as a transport, ignored for WebSockets); */
  withCredentials?: boolean
  /** the number of events that should be returned when polling; the default is 1 (polling returns an object), passing a higher number will have the backend return an array of objects instead (again, only valid for HTTP usage as this is strictly related to long polling, ignored for WebSockets); */
  max_poll_events?: number
  /** whether we should destroy automatically try and destroy this session via Janus API when onbeforeunload is called (true by default); */
  destroyOnUnload?: boolean
  /** optional parameters only needed in case you're Authenticating the Janus API ; */
  token?: string
  /** optional parameters only needed in case you're Authenticating the Janus API ; */
  apisecret?: string
  
  /** a set of callbacks to be notified about events, namely: */
  /** the session was successfully created and is ready to be used; */
  success?: () => void
  /** the session was NOT successfully created; */
  error?: (e: string) => void
  /** the session was destroyed and can't be used any more. */
  destroyed?: () => void
}

interface JanusHandle {
  //getVolume, getLocalVolume, getRemoteVolume, `id`, `detached`
  //isAudioMuted, isVideoMuted
  //muteAudio, muteVideo
  //unmuteAudio unmuteVideo
/**
plugin: "janus.plugin.videoroom"
? session: Janus {destroyOnUnload: true, getServer: ƒ, isConnected: ƒ, reconnect: ƒ, getSessionId: ƒ, …}
token: null
webrtcStuff: object
 */

  /** returns the unique handle identifier; */
  getId(): any
  /** returns the unique package name of the attached plugin; */
  getPlugin(): any
  /** sends a message (with or without a jsep to negotiate a PeerConnection) to the plugin; */
  send(parameters): any
  /** asks the library to create a WebRTC compliant OFFER; */
  createOffer(callbacks): any
  /** asks the library to create a WebRTC compliant ANSWER; */
  createAnswer(callbacks): any
  /** asks the library to handle an incoming WebRTC compliant session description; */
  handleRemoteJsep(callbacks): any
  /** sends a DTMF tone on the PeerConnection; */
  dtmf(parameters): any
  /** sends data through the Data Channel, if available; */
  data(parameters): any
  /** gets a verbose description of the currently received stream bitrate; */
  getBitrate(): any
  /** tells the library to close the PeerConnection; if the optional sendRequest argument is set to true, then a hangup Janus API request is sent to Janus as well (disabled by default, Janus can usually figure this out via DTLS alerts and the like but it may be useful to enable it sometimes); */
  hangup(sendRequest): any
  /** detaches from the plugin and destroys the handle, tearing down the related PeerConnection if it exists. */
  detach(parameters): any
}

/** a set of callbacks to be notified about events, namely: */
interface JanusAttachCallback {
  /** the handle was successfully created and is ready to be used; */
  success?: (handle: JanusHandle) => void
  /** the handle was NOT successfully created; */
  error?: (e: string) => void
  /** this callback is triggered just before getUserMedia is called (parameter=true) and after it is completed (parameter=false); this means it can be used to modify the UI accordingly, e.g., to prompt the user about the need to accept the device access consent requests; */
  consentDialog?: (on: boolean) => void
  /** this callback is triggered with a true value when the PeerConnection associated to a handle becomes active (so ICE, DTLS and everything else succeeded) from the Janus perspective, while false is triggered when the PeerConnection goes down instead; useful to figure out when WebRTC is actually up and running between you and Janus (e.g., to notify a user they're actually now active in a conference); notice that in case of false a reason string may be present as an optional parameter; */
  webrtcState?: (active: boolean, reason?: string) => void
  /** this callback is triggered when the ICE state for the PeerConnection associated to the handle changes: the argument of the callback is the new state as a string (e.g., "connected" or "failed"); */
  iceState?: (state: string) => void
  /** this callback is triggered when Janus starts or stops receiving your media: for instance, a mediaState with type=audio and on=true means Janus started receiving your audio stream (or started getting them again after a pause of more than a second); a mediaState with type=video and on=false means Janus hasn't received any video from you in the last second, after a start was detected before; useful to figure out when Janus actually started handling your media, or to detect problems on the media path (e.g., media never started, or stopped at some time); */
  mediaState?: (type: string, on: boolean) => void
  /** this callback is triggered when Janus reports trouble either sending or receiving media on the specified PeerConnection, typically as a consequence of too many NACKs received from/sent to the user in the last second: for instance, a slowLink with uplink=true means you notified several missing packets from Janus, while uplink=false means Janus is not receiving all your packets; useful to figure out when there are problems on the media path (e.g., excessive loss), in order to possibly react accordingly (e.g., decrease the bitrate if most of our packets are getting lost); */
  slowLink?: (uplink: boolean, lost: any) => void
  /** a message/event has been received from the plugin; */
  onmessage?: (msg: any, jsep: any) => void
  /** a local MediaStream is available and ready to be displayed; */
  onlocalstream?: (stream: any) => void
  /** a remote MediaStream is available and ready to be displayed; */
  onremotestream?: (stream: any) => void
  /** a Data Channel is available and ready to be used; */
  ondataopen?: (label: any) => void
  /** data has been received through the Data Channel; */
  ondata?: (data: any, label: any) => void
  /** the WebRTC PeerConnection with the plugin was closed; */
  oncleanup?: () => void
  /** the plugin handle has been detached by the plugin itself, and so should not be used anymore. */
  ondetached?: () => void
}

interface JanusAttachOptions extends JanusAttachCallback {
  /** the unique package name of the plugin (e.g., janus.plugin.echotest ); */
  plugin: string
  /** an optional opaque string meaningful to your application (e.g., to map all the handles of the same user); */
  opaqueId?: string
}

interface JanusDestroyOptions {
  success?: () => void
  error?: (e: string) => void
  /** default: false */
  unload?: boolean
  /** default: true */
  notifyDestroyed?: boolean
  /** default: false */
  cleanupHandles?: boolean
}

declare class Janus {
  static init: (options: JanusInitOptions) => void
  static initPromise: (options: JanusInitOptions) => Promise<void>
  static newPromise: (options: JanusOptions) => Promise<Janus>
  attachPromise: (options: JanusAttachOptions) => Promise<JanusHandle>

  constructor(options: JanusOptions)

  /** returns the address of the server; */
  getServer(): string
  /** returns true if the Janus instance is connected to the server, false otherwise; */
  isConnected(): boolean
  /** returns the unique Janus session identifier; */
  getSessionId(): number
  /** attaches the session to a plugin, creating an handle; more handles to the same or different plugins can be created at the same time; */
  attach(parameters: JanusAttachOptions): void
  /** destroys the session with the server, and closes all the handles (and related PeerConnections) the session may have with any plugin as well. */
  destroy(parameters?: JanusDestroyOptions): void
  // reconnect
}

Janus.initPromise = async function(options: JanusInitOptions) {
  return new Promise(callback => Janus.init({ ...options, callback }))
}

Janus.newPromise = async function(options: JanusOptions) {
  return new Promise((resolve, reject) => {
    const session = new Janus({
      ...options,
      success: () => resolve(session),
      error: (e) => reject(new Error(e))
    })
  })
}

Janus.prototype.attachPromise = async function(options: JanusAttachOptions) {
  return new Promise((resolve, reject) => this.attach({
    ...options,
    success: (handle: JanusHandle) => resolve(handle),
    error: (reason: string) => reject(new Error(reason))
  }))
}

export default Janus
