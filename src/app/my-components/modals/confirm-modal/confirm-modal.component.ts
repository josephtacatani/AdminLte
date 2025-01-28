import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  @Input() isVisible: boolean = false; // Controls modal visibility
  @Input() title: string = 'Confirm Action'; // Modal title
  @Input() message: string = 'Are you sure?'; // Modal message
  @Input() confirmText: string = 'Confirm'; // Confirm button text
  @Input() cancelText: string = 'Cancel'; // Cancel button text
  @Input() countdown?: number; // ✅ Show countdown

  @Output() closeModal = new EventEmitter<void>(); // Emits when closing modal
  @Output() confirmAction = new EventEmitter<void>(); // Emits when confirming action

  /** ✅ Close Modal */
  close(): void {
    this.isVisible = false;
    this.closeModal.emit();
  }

  /** ✅ Confirm Action */
  confirm(): void {
    this.isVisible = false;
    this.confirmAction.emit(); // Executes the action (e.g., logout)
  }
}
