import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() title!: string; // Dynamic title for the card
  @Input() imageSrc!: string; // Profile image source
  @Input() name!: string; // Display name
  @Input() subtitle!: string; // Secondary info (e.g., email)
  @Input() details!: { label: string; value: string }[]; // List of key-value pairs for card details

}
