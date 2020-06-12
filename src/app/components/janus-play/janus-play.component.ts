import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { JanusService } from 'src/app/janus.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-janus-play',
  templateUrl: './janus-play.component.html',
  styleUrls: ['./janus-play.component.scss'],
})
export class JanusPlayComponent implements OnInit {

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
      this.modalctl.dismiss('Room not existed')
    }
  }

  closeModal() {
    this.modalctl.dismiss()
  }
}
