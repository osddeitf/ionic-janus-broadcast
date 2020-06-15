import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Janus from 'src/app/utils/janus';
import { JanusService } from 'src/app/janus.service';

@Component({
  selector: 'app-janus-publish',
  templateUrl: './janus-publish.component.html',
  styleUrls: ['./janus-publish.component.scss'],
})
export class JanusPublishComponent implements OnInit, OnDestroy {

  room: any
  stream: any
  @ViewChild('video') video: ElementRef

  constructor(
    private janus: JanusService,
    private modalctl: ModalController
  ) { }

  async ngOnInit() {
    await this.janus.connect()
    this.room = await this.janus.createRoom()

    this.janus.listen().subscribe({
      next: event => this.handleEvent(event)
    })
    await this.janus.join(this.room, { ptype: 'publisher' })
    /** -> publish -> attachMediaStream */
  }

  async ngOnDestroy() {
    await this.janus.destroy(this.room)
    await this.janus.disconnect()
  }

  private handleEvent(event) {
    if (event.type === 'message') {
      const type = event.message.videoroom
      if (type === 'joined') this.janus.publish()
    }
    else if (event.type === 'localstream') {
      this.stream = event.stream
      Janus.attachMediaStream(this.video.nativeElement, this.stream)
    }
  }

  closeModal() {
    this.modalctl.dismiss()
  }
}
