import { Component, OnInit } from '@angular/core';
import { JanusPublishService } from '../janus-publish.service';
import { Router } from '@angular/router';
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

  ngOnInit() { }

  closeModal() {
    this.modalctl.dismiss()
  }
}
