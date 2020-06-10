import { Component } from '@angular/core';
import Janus from '../utils/janus';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {}

  async ngOnInit() {
    await Janus.initPromise({ debug: 'all' })

    // const session = new Janus({
    const session = await Janus.newPromise({
      server: 'http://localhost:8088/janus',
      destroyed: () => console.log('destroyed')
    })

    // ;(Janus as any).listDevices(x => console.log(x))
    const handle = await session.attachPromise({
      plugin: "janus.plugin.videoroom",
      consentDialog: (on) => console.log('consentDialog', on),
      webrtcState: (active, reason) => console.log('webrtcState', active, reason),
      iceState: (state) => console.log('iceState', state),
      mediaState: (type, on) => console.log('mediaState', type, on),
      slowLink: (uplink, lost) => console.log('slowLink', uplink, lost),
      onmessage: (msg, jsep) => console.log('onmessage', msg, jsep),
      onlocalstream: (stream) => console.log('onlocalstream', stream),
      onremotestream: (stream) => console.log('onremotestream', stream),
      ondataopen: (label) => console.log('ondataopen', label),
      ondata: (data, label) => console.log('ondata', data, label),
      oncleanup: () => console.log('oncleanup'),
      ondetached: () => console.log('ondetached')
    })
  }

}
