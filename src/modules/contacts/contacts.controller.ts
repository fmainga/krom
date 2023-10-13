import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contacts } from 'src/database/entities/contact.entity';
import { AuthGuard } from '../auth/guards/auth.guards';
import { Request } from 'express';

@Controller({ path: 'contacts', version: '1' })
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private contactService: ContactsService) {}

  @Post()
  createContacts(@Req() request: Request) {
    return this.contactService.createContact(request);
  }
  @Get()
  fetchContacts(@Req() request: Request) {
    return this.contactService.fetchContacts(request);
  }
  @Get(':contact')
  fetchContact(@Req() request: Request) {
    return this.contactService.fetchContact(request);
  }

  @Patch(':contact')
  updateContactInformation(@Req() request: Request) {
    return this.contactService.updateContact(request);
  }

  @Delete(':contact')
  deleteContact(@Req() request: Request) {
    return this.contactService.deleteContact(request);
  }
}
