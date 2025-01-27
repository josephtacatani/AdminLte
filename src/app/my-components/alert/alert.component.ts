import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @Input() message: string | null = null; // ✅ Input for message content
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'success'; // ✅ Include 'info'
  @Input() autoDismiss: boolean = true; // ✅ Auto-dismiss after a few seconds

  @Output() dismiss = new EventEmitter<void>(); // ✅ Output event for dismissal

  ngOnInit(): void {
    if (this.autoDismiss) {
      setTimeout(() => {
        this.dismiss.emit(); // ✅ Notify parent to clear alert
      }, 3000);
    }
  }

  closeAlert(): void {
    this.dismiss.emit(); // ✅ Notify parent when manually closed
  }
}
