import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { JanusService } from 'src/app/janus.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-janus-play',
  templateUrl: './janus-play.component.html',
  styleUrls: ['./janus-play.component.scss'],
})
export class JanusPlayComponent implements OnInit {

  @ViewChild('video') video: ElementRef

  constructor(
    private janus: JanusService,
    private modalctl: ModalController
  ) { }

  ngOnInit() {}

  closeModal() {
    this.modalctl.dismiss()
  }
}
