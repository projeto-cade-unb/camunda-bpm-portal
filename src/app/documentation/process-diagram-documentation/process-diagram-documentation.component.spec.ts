import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDiagramDocumentationComponent } from './process-diagram-documentation.component';

describe('ProcessDiagramDocumentationComponent', () => {
  let component: ProcessDiagramDocumentationComponent;
  let fixture: ComponentFixture<ProcessDiagramDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessDiagramDocumentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessDiagramDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
