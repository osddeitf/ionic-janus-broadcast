import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { JanusService } from 'src/app/janus.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-janus-play',
  templateUrl: './janus-play.component.html',
  styleUrls: ['./janus-play.component.scss'],
})
export class JanusPlayComponent implements OnInit, OnDestroy {

  @Input() room: any
  @ViewChild('video') video: ElementRef

  constructor(
    private janus: JanusService,
    private modalctl: ModalController
  ) { }

  async ngOnInit() {
    await this.janus.connect()

    const exists = await this.janus.roomExists(this.room)
    if (!exists) {
      return this.modalctl.dismiss('Room not existed')
    }

    this.janus.listen().subscribe({
      next: event => this.handleEvent(event)
    })

    const publishers = await this.janus.listpublisher(this.room)
    if (publishers.length === 0) {
      return this.modalctl.dismiss('Zombie room')
    }
    const feed = publishers.shift().id
    await this.janus.join(this.room, { ptype: 'subscriber', feed })
  }

  private handleEvent(event) {
    console.log(event)
    if (event.type === 'message') {
      const type = event.message.videoroom
      if (type === 'joined') {
      }
    }
    else if (event.type === 'localstream') {
      // this.onLocalStream(event.stream)
    }
  }

  async ngOnDestroy() {
    await this.janus.disconnect()
  }

  closeModal() {
    this.modalctl.dismiss()
  }
}
