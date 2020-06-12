import { Component } from '@angular/core';
import { JanusPublishService } from './janus-publish.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  status: string

  constructor(private router: Router, private janus: JanusPublishService) {}

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
    await this.router.navigateByUrl('/tabs/tab1/publish')
  }
}
