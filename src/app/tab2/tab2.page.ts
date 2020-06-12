import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { JanusService } from '../janus.service';
import { JanusPlayComponent } from '../components/janus-play/janus-play.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

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

  async submit(event) {
    event.preventDefault()
    const modal = await this.modalctl.create({
      component: JanusPlayComponent,
      animated: true
    })
    await modal.present()
  }
}
