import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatorComponent } from './annotator.component';

describe('AnnotatorComponent', () => {
  let component: AnnotatorComponent;
  let fixture: ComponentFixture<AnnotatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
