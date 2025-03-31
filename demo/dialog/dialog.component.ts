import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgFor, NgStyle } from '@angular/common';
import { Shape } from 'image-labeling';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [NgFor, NgStyle, CommonModule, ReactiveFormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  constructor(private fb: FormBuilder) { }

  @Output() hide = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() updateCategories = new EventEmitter<string[]>();
  @Input() set shape(value: Shape) {
    this.offset = { X: value.getCenterWithOffset().X.toString() + 'px', Y: value.getCenterWithOffset().Y.toString() + 'px' }
    const arr = this.categories.map(cat => this.fb.control(value.categories.includes(cat)));
    this.form = this.fb.group({ categories: this.fb.array(arr) });
  }

  form!: FormGroup<{ categories: FormArray<any>; }>;
  offset!: { X: string, Y: string }
  categories = ['blueberry', 'strawberry', 'raspberry', 'apple', 'benana'];
  get items() { return this.form.get('categories') as FormArray; }

  onEdit() { 
    this.onClose();
    this.edit.emit();
  }
  onDelete() { 
    this.onClose();
    this.delete.emit();
  }
  onClose() {
    let selectedCategories = this.categories.filter((cat, i) => this.items.value[i]);
    this.updateCategories.emit(selectedCategories);
    this.hide.emit();
  }
}
