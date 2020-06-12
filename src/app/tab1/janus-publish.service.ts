import { Injectable } from '@angular/core';
import Janus from '../utils/janus';
import JanusHandle from '../utils/janus_handle';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JanusPublishService {

  private handle: JanusHandle
  private events: Subject<any>
  private room: any
  private server = 'http://localhost:8088/janus'

  constructor() {
    this.events = new Subject<any>()
  }

  listen() {
    return this.events.asObservable()
  }

  init(debug?: any) {
    return new Observable<string>(subscribe => {
      (async () => {
        try {
          subscribe.next("initializing...")

          await Janus.initPromise({ debug })

          subscribe.next("creating session...")

          // const session = new Janus({
          const session = await Janus.newPromise({
            server: this.server,
            destroyed: () => console.log('destroyed')
          })

          subscribe.next("attaching to plugin...")

          // ;(Janus as any).listDevices(x => console.log(x))
          this.handle = await session.attachPromise({
            plugin: "janus.plugin.videoroom",
            consentDialog: (on) => console.log('consentDialog', on),
            webrtcState: (active, reason) => console.log('webrtcState', active, reason),
            iceState: (state) => console.log('iceState', state),
            mediaState: (type, on) => console.log('mediaState', type, on),
            slowLink: (uplink, lost) => console.log('slowLink', uplink, lost),
            onmessage: (message, jsep) => this.events.next({ type: 'message', message, jsep }),
            onlocalstream: (stream) => this.events.next({ type: 'localstream', stream }),
            onremotestream: (stream) => console.log('onremotestream', stream),
            ondataopen: (label) => console.log('ondataopen', label),
            ondata: (data, label) => console.log('ondata', data, label),
            oncleanup: () => console.log('oncleanup'),
            ondetached: () => console.log('ondetached')
          })

          /** Enable promise */
          this.handle = Janus.extendHandle(this.handle)
          subscribe.complete()
        }
        catch (e) {
          subscribe.error(e)
        }
      })()
    })
  }

  async createRoom() {
    const message = { request: 'create' }
    const response = await this.handle.sendAsync({ message })
    this.room = response.room
  }

  async join() {
    const message = {
      request: 'join',
      ptype: 'publisher',
      room: this.room
    }
    // attach's onmessage event
    this.handle.send({ message })
  }

  async offer() {
    const jsep = await this.handle.createOfferAsync({
      media: { video: "hires", audio: true }
    })
  }
}
