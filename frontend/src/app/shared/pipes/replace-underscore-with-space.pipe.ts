import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceUnderscoreWithSpace'
})
export class ReplaceUnderscoreWithSpacePipe implements PipeTransform {

  transform(value: string): string {
    if (value) {
      return value.replace(/_/g, ' ');
    }
    return value;
  }

} 