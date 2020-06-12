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

export interface JanusCreateOfferOptions {
  success?: (jsep: any) => void
  error?: (e: string) => void
  customizeSdp?: (data: any) => void

  /** default { audio: true, video: true } */
  media?: {
    audioSend?: boolean
    audioRecv?: boolean
    audio?: boolean | { deviceId: any }
    videoSend?: boolean
    videoRecv?: boolean
    video?:
      "screen" |
      ("lowres" | "lowres-16:9" | "stdres" | "stdres-16:9" | "hires" | "hires-16:9") |
      { deviceId: any, width?: number, height?: number }
    /** do or do not use Data Channels, default is false */
    data?: boolean

    /** whether a getUserMedia should fail if audio send is asked, but no audio device is available, default is false */
    failIfNoAudio?: boolean
    /** whether a getUserMedia should fail if video send is asked, but no video device is available, default is false */
    failIfNoVideo?: boolean
    /** in case you're sharing a screen/application, allows you to specify the framerate (default=3); */
    screenshareFrameRate?: number

    /** if set, start capturing audio if you weren't (will fail if you're sending audio already) */
    addAudio?: boolean
    /** if set, start capturing video if you weren't (will fail if you're sending video already) */
    addVideo?: boolean
    /** if set, negotiate a datachannel if it didn't exist (is actually just a synonym for data:true ) */
    addData?: boolean
    /** if set, stop capturing audio and remove the local audio track */
    removeAudio?: boolean
    /** if set, stop capturing video and remove the local video track */
    removeVideo?: boolean
    /** if set, stop capturing the current audio (remove the local audio track), and capture a new audio source */
    replaceAudio?: boolean
    /** if set, stop capturing the current video (remove the local video track), and capture a new video source */
    replaceVideo?: boolean
  }
  
  simulcast?: boolean
  simulcast2?: boolean

  /** to tell the library whether you want Trickle ICE to be used (true, the default) or not (false) */
  trickle?: boolean
  stream?: any

  /** ... various options not listed ... */
}

export interface JanusDetachOptions {
  success?: () => void
  error?: (msg: string) => void
  noRequest?: boolean
}
