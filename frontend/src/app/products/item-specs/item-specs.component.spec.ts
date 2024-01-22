import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSpecsComponent } from './item-specs.component';

describe('ItemSpecsComponent', () => {
  let component: ItemSpecsComponent;
  let fixture: ComponentFixture<ItemSpecsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemSpecsComponent]
    });
    fixture = TestBed.createComponent(ItemSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
