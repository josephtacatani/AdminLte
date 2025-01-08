import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss']
})
export class LogoutModalComponent {
  @Input() isVisible: boolean = false; // Control modal visibility
  @Input() title: string = 'Modal Title'; // Title of the modal
  @Output() closeModal = new EventEmitter<void>(); // Emit when modal closes
  @Output() confirmAction = new EventEmitter<void>(); // Emit on confirm button

  close(): void {
    this.closeModal.emit(); // Notify parent to close the modal
  }

  confirm(): void {
    this.confirmAction.emit(); // Notify parent to confirm action
  }
}
