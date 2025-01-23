import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @Input() message: string | null = null; // ✅ Input for message content
  @Input() type: 'success' | 'danger' | 'warning' = 'success'; // ✅ Input for alert type
  @Input() autoDismiss: boolean = true; // ✅ Auto-dismiss after a few seconds

  ngOnInit(): void {
    if (this.autoDismiss) {
      setTimeout(() => {
        this.message = null; // ✅ Clear message after 3 seconds
      }, 3000);
    }
  }

  closeAlert(): void {
    this.message = null;
  }
}
