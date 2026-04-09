import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'paidCount', standalone: true })
export class PaidCountPipe implements PipeTransform {
  transform(installments: any[]): number {
    if (!installments) return 0;
    return installments.filter(i => i.status === 'CONFIRMED').length;
  }
}
