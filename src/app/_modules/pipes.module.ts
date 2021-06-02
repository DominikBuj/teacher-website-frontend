import {NgModule} from '@angular/core';
import {EnumValuesPipe} from '../_helpers/enum-values.pipe';
import {EnumKeysPipe} from '../_helpers/enum-keys.pipe';

@NgModule({
  declarations: [EnumValuesPipe, EnumKeysPipe],
  exports: [EnumValuesPipe, EnumKeysPipe]
})
export class PipesModule { }
