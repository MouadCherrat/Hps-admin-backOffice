import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullFormatter'
})
export class NullFormatterPipe implements PipeTransform {
  transform(value: any): string {
    return value ? value : '<i class="text-gray-400">NULL</i>';
  }
}
