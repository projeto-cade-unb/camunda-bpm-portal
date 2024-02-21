import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramDocumentationComponent } from './diagram-documentation.component';

describe('DiagramDocumentationComponent', () => {
  let component: DiagramDocumentationComponent;
  let fixture: ComponentFixture<DiagramDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagramDocumentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
