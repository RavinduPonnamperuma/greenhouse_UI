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
  @Input() statusValue: string = 'Available';  // accept any string status

  get badgeType(): 'green' | 'red' {
    const greenStatuses = ['active', 'available', 'growing'];
    const redStatuses = ['inactive', 'Unavailable'];

    if (greenStatuses.includes(this.statusValue)) {
      return 'green';
    } else if (redStatuses.includes(this.statusValue)) {
      return 'red';
    } else {
      return 'red'; // default to red if unknown status
    }
  }
}
