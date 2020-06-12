import { JanusInitOptions, JanusOptions, JanusAttachOptions, JanusDestroyOptions, JanusSendOptions } from './janus_options'
import JanusHandle, { handleExtended } from './janus_handle'

declare class Janus {
  static init(options: JanusInitOptions): void
  static listDevices(callback): void
  static attachMediaStream(element: any, stream: any): void

  /** EXTENSIONS */
  static initPromise(options: JanusInitOptions): Promise<void>
  static newPromise(options: JanusOptions): Promise<Janus>
  attachPromise(options: JanusAttachOptions): Promise<JanusHandle>
  static extendHandle(handle: JanusHandle): JanusHandle

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

Janus.extendHandle = function(handle: JanusHandle) {
  return { ...handle, ...handleExtended }
}

export default Janus
