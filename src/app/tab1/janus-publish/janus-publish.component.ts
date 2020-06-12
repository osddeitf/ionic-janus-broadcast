import { Component, OnInit } from '@angular/core';
import { JanusPublishService } from '../janus-publish.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-janus-publish',
  templateUrl: './janus-publish.component.html',
  styleUrls: ['./janus-publish.component.scss'],
})
export class JanusPublishComponent implements OnInit {

  stream: any

  constructor(
    private janus: JanusPublishService,
    private modalctl: ModalController
  ) { }

  async ngOnInit() {
    await this.janus.createRoom()
    this.janus.listen().subscribe({
      next: event => this.handleEvent(event)
    })
    this.janus.join()
  }

  private handleEvent(event) {
    if (event.type === 'message') {
      const type = event.message.videoroom
      if (type === 'joined') this.onJoined()
    }
    else if (event.type === 'localstream') {
      this.onLocalStream(event.stream)
    }
  }

  private onJoined() {
    console.log("JOINED")
    this.janus.offer()
  }

  private onLocalStream(stream: any) {
    console.log("Stream")
    this.stream = stream
  }

  closeModal() {
    this.modalctl.dismiss()
  }
}
