import { Component, ViewChild } from '@angular/core';
import { ModalController, IonInput } from '@ionic/angular';
import { JanusService } from '../janus.service';
import { JanusPlayComponent } from '../components/janus-play/janus-play.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  status: string
  errorMessage: string
  @ViewChild('room') roomInput: IonInput

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
    const room = Number(this.roomInput.value.toString() || undefined)
    if (Number.isNaN(room) || !Number.isInteger(room)) {
      return this.errorMessage = 'RoomID invalid, required a positive integer'
    }

    const modal = await this.modalctl.create({
      component: JanusPlayComponent,
      componentProps: { room },
      animated: true
    })
    modal.onWillDismiss().then(response => this.errorMessage = response.data)
    await modal.present()
  }
}
