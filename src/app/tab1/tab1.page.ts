import { Component } from '@angular/core';
import { JanusPublishService } from './janus-publish.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { JanusPublishComponent } from './janus-publish/janus-publish.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  status: string

  constructor(
    private janus: JanusPublishService,
    private modalctl: ModalController
  ) {}

  async ngOnInit() {
    this.janus.init('all').subscribe({
      next: status => this.status = status,
      error: e => console.log(e),
      complete: () => this.status = 'ready'
    })
  }

  async submit(event) {
    event.preventDefault()
    await this.janus.createRoom()
    const modal = await this.modalctl.create({
      component: JanusPublishComponent,
      animated: true
    })
    await modal.present()
  }
}
