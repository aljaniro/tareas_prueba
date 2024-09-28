import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareaslistaComponent } from './tareaslista.component';

describe('TareaslistaComponent', () => {
  let component: TareaslistaComponent;
  let fixture: ComponentFixture<TareaslistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TareaslistaComponent]
    });
    fixture = TestBed.createComponent(TareaslistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
