import { Component, OnInit } from '@angular/core';
import { JanusPublishService } from '../janus-publish.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-janus-publish',
  templateUrl: './janus-publish.component.html',
  styleUrls: ['./janus-publish.component.scss'],
})
export class JanusPublishComponent implements OnInit {

  constructor(
    private janus: JanusPublishService,
    private modalctl: ModalController
  ) { }

  ngOnInit() {
    this.janus.listen().subscribe({
      next: event => this.handleEvent(event)
    })
    this.janus.join()
  }

  handleEvent(event) {
    const type = event.message.videoroom
    if (type === 'joined') this.onJoined()
  }

  onJoined() {
    console.log("JOINED")
  }

  closeModal() {
    this.modalctl.dismiss()
  }
}
