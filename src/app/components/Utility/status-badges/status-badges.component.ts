import {Component, Input} from '@angular/core';
import {NgSwitch, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-status-badges',
  standalone: true,
  imports: [
    NgSwitchCase,
    NgSwitch
  ],
  templateUrl: './status-badges.component.html',
  styleUrl: './status-badges.component.scss'
})
export class StatusBadgesComponent {
  @Input() statusValue: string = 'Available';

  get badgeType(): 'green' | 'red' | 'yellow' {
    const normalized = this.statusValue?.toLowerCase();

    const greenStatuses = ['active', 'available', 'growing'];
    const redStatuses = ['inactive', 'unavailable'];
    const yellowStatuses = ['maintenance', 'pending'];

    if (greenStatuses.includes(normalized)) {
      return 'green';
    } else if (redStatuses.includes(normalized)) {
      return 'red';
    } else if (yellowStatuses.includes(normalized)) {
      return 'yellow';
    } else {
      return 'red';
    }
  }
}
