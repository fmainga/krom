/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { Utils } from './utils.service';

@Controller({ path: 'ss', version: '1' })
export class UtilsController {
  constructor(private utils: Utils) {}

  @Get()
  gimmeStuff() {
    return this.utils.genKeys();
  }
}
