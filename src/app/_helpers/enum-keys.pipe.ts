import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'enumKeys'
})
export class EnumKeysPipe implements PipeTransform {
  transform(enumValue: object): string[] {
    const keys = Object.keys(enumValue);
    return keys.slice(keys.length / 2);
  }
}
