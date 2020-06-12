import { JanusSendOptions, JanusCreateOfferOptions, JanusDetachOptions } from './janus_options';

export default interface JanusHandle {
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
  send(parameters: JanusSendOptions): any
  /** asks the library to create a WebRTC compliant OFFER; */
  createOffer(callbacks: JanusCreateOfferOptions): any
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
  detach(parameters?: JanusDetachOptions): any

  /** Extended version */
  sendAsync(parameters: JanusSendOptions): Promise<any>
  createOfferAsync(options: JanusCreateOfferOptions): Promise<any>
}

export const handleExtended = {
  sendAsync: async function(this: JanusHandle, options: JanusSendOptions) {
    return new Promise((resolve, reject) =>
      this.send({ ...options, success: resolve, error: reject })
    )
  },
  createOfferAsync: async function(this: JanusHandle, options: JanusCreateOfferOptions) {
    return new Promise((resolve, reject) =>
      this.createOffer({ ...options, success: resolve, error: reject })
    )
  }
}
