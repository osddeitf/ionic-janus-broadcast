import { Injectable } from '@angular/core';
import Janus from './utils/janus';
import JanusHandle from './utils/janus_handle';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JanusService {

  private session: Janus
  private handle: JanusHandle
  private events: Subject<any>
  private server = 'http://localhost:8088/janus'

  constructor() {
    this.events = new Subject<any>()
  }

  private onMessage(message, jsep) {
    this.events.next({ type: 'message', message, jsep })
    if (jsep !== undefined && jsep !== null && message?.videoroom !== 'attached') {
      this.handle.handleRemoteJsep({ jsep })
    }
  }

  listen() {
    return this.events.asObservable()
  }

  init(debug?: any) {
    return new Observable<string>(subscribe => {
      subscribe.next("initializing...")
      Janus.init({
        debug,
        callback: () => {
          subscribe.next("creating session...")
          this.session = new Janus({
            server: this.server,
            success: () => subscribe.complete(),
            error: e => subscribe.error(e),
            destroyed: () => console.log('destroyed')
          })
        }
      })
      
    })
  }

  async createRoom(options?: VideoroomCreateOptions) {
    const message = { request: 'create', ...options }
    const response = await this.handle.sendAsync({ message })
    return response.room
  }

  async listroom() {
    const message = { request: 'list' }
    return await this.handle.sendAsync({ message })
  }

  async listpublisher(room: number) {
    const message = { request : "listparticipants", room }
    const response = await this.handle.sendAsync({ message })
    return response.participants.filter(x => x.publisher)
  }

  async join(room: number, options: any) {
    const message = {
      request: 'join', room, ...options
    }
    // attach's onmessage event
    await this.handle.send({ message })
  }

  async publish() {
    const jsep = await this.handle.createOfferAsync({
      media: { video: 'hires', audioRecv: false, videoRecv: false, audioSend: true, videoSend: true },	// Publishers are sendonly
    })
    const message = {
      request: 'configure',
      audio: true,
      video: true
    }
    await this.handle.send({ message, jsep })
  }

  async subscribe(room: number, jsep: any) {
    const rjsep = await this.handle.createAnswerAsync({
      jsep,
      media: { audioSend: false, videoSend: false }
    })

    const message = { request: 'start', room }
    this.handle.send({ message, jsep: rjsep })
  }

  async connect() {
    this.handle = await this.session.attachPromise({
      plugin: "janus.plugin.videoroom",
      consentDialog: (on) => console.log('consentDialog', on),
      webrtcState: (active, reason) => this.events.next({ type: 'webrtcState', active, reason }),
      iceState: (state) => console.log('iceState', state),
      mediaState: (type, on) => console.log('mediaState', type, on),
      slowLink: (uplink, lost) => console.log('slowLink', uplink, lost),
      onmessage: (message, jsep) => this.onMessage(message, jsep),
      onlocalstream: (stream) => this.events.next({ type: 'localstream', stream }),
      onremotestream: (stream) => this.events.next({ type: 'remotestream', stream }),
      ondataopen: (label) => console.log('ondataopen', label),
      ondata: (data, label) => console.log('ondata', data, label),
      oncleanup: () => console.log('oncleanup'),
      ondetached: () => console.log('ondetached')
    })

    /** Enable promise */
    this.handle = Janus.extendHandle(this.handle)
  }

  async disconnect() {
    if (this.handle) {
      this.handle.detach()
      this.handle = null
    }
  }

  async shutdown() {
    if (this.session) {
      this.session.destroy({ cleanupHandles: true })
    }
  }

  async roomExists(room: number) {
    const message = { request: 'exists', room }
    const response = await this.handle.sendAsync({ message })
    console.log(response)
    return response.exists
  }

  async destroy(room: number) {
    const message = { request: 'destroy', room }
    return this.handle.sendAsync({ message })
  }
}
