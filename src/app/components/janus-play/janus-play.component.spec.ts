import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JanusPlayComponent } from './janus-play.component';

describe('JanusPlayComponent', () => {
  let component: JanusPlayComponent;
  let fixture: ComponentFixture<JanusPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JanusPlayComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JanusPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
