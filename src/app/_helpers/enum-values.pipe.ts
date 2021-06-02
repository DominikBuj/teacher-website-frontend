import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'enumValues'
})
export class EnumValuesPipe implements PipeTransform {
  transform(enumValue: object): string[] {
    const keys = Object.keys(enumValue);
    return keys.slice(0, keys.length / 2);
  }
}
