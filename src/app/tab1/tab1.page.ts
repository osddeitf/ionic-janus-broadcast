import { Component } from '@angular/core';
import { JanusService } from '../janus.service';
import { ModalController } from '@ionic/angular';
import { JanusPublishComponent } from '../components/janus-publish/janus-publish.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  status: string

  constructor(
    private janus: JanusService,
    private modalctl: ModalController
  ) {}

  ionViewDidEnter() {
    this.janus.init('all').subscribe({
      next: status => this.status = status,
      error: e => console.log(e),
      complete: () => this.status = 'ready'
    })
  }

  ionViewDidLeave() {
    this.janus.shutdown()
  }

  async submit() {
    const modal = await this.modalctl.create({
      component: JanusPublishComponent,
      animated: true
    })
    await modal.present()
  }

}
