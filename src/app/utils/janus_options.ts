import JanusHandle from './janus_handle';

export interface JanusInitOptions {
  debug?: boolean | "all" | ("trace"| "debug"| "log"| "warn"| "error")[];
  dependencies?: any,
  callback?: () => any
}

export interface JanusOptions {
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

/** a set of callbacks to be notified about events, namely: */
export interface JanusAttachCallback {
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

export interface JanusAttachOptions extends JanusAttachCallback {
  /** the unique package name of the plugin (e.g., janus.plugin.echotest ); */
  plugin: string
  /** an optional opaque string meaningful to your application (e.g., to map all the handles of the same user); */
  opaqueId?: string
}

export interface JanusDestroyOptions {
  success?: () => void
  error?: (e: string) => void
  /** default: false */
  unload?: boolean
  /** default: true */
  notifyDestroyed?: boolean
  /** default: false */
  cleanupHandles?: boolean
}

export interface JanusSendOptions {
  message?: { [key: string]: any }
  jsep?: any
  success?: (data?: any) => void
  error?: (msg: string) => void
}
