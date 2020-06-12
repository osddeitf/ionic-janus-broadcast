import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JanusPublishComponent } from './janus-publish.component';

describe('JanusPublishComponent', () => {
  let component: JanusPublishComponent;
  let fixture: ComponentFixture<JanusPublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JanusPublishComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JanusPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
