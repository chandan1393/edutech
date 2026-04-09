import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusCount', standalone: true })
export class StatusCountPipe implements PipeTransform {
  transform(assignments: any[], status: string): number {
    if (!assignments) return 0;
    return assignments.filter(a => a.status === status).length;
  }
}
