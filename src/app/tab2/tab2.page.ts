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
  rooms: number[] = null
  room: number = null
  @ViewChild('room') roomInput: IonInput

  constructor(
    private janus: JanusService,
    private modalctl: ModalController
  ) {}

  ionViewDidEnter() {
    this.janus.init('all').subscribe({
      next: status => this.status = status,
      error: e => console.log(e),
      complete: () => this.ready()
    })
  }

  async ready() {
    this.status = 'Connecting to plugin...'
    await this.janus.connect()
    
    this.status = 'Getting room list...'
    const response = await this.janus.listroom()
    if (response.videoroom !== 'success') {
      this.status = 'Failed getting room list'
    }
    else {
      this.rooms = response.list.filter(x => x.num_participants !== 0).map(x => x.room)
      this.status = "Ready"
    }
    this.janus.disconnect()
  }

  ionViewDidLeave() {
    this.janus.shutdown()
  }

  onSelect(event) {
    this.room = event.target.value
  }

  async submit() {
    const modal = await this.modalctl.create({
      component: JanusPlayComponent,
      componentProps: { room: this.room },
      animated: true
    })
    modal.onWillDismiss().then(response => this.errorMessage = response.data)
    await modal.present()
  }
}
