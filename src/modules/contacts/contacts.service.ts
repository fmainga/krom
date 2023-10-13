import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Contacts } from 'src/database/entities/contact.entity';
import { SystemDataSource } from 'src/database/system.datasource';
import { Utils } from 'src/utils/utils.service';
import { Request } from 'express';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ContactsService {
  constructor(private utils: Utils) {}
  async createContact(request: Request) {
    try {
      const contact: Partial<Contacts> = request.body;
      contact['phone_number'] = this.utils.encryptData(contact.phone_number);
      contact['name'] = this.utils.encryptData(contact.name);
      contact['user'] = request.query?.['user'] as any;
      await SystemDataSource.manager.save(Contacts, contact);
      return {
        statusCode: 200,
        description: 'Contact successfully added',
      };
    } catch (error) {
      throw new BadRequestException('Contact not added');
    }
  }

  async fetchContacts(request: Request) {
    try {
      const skippedItems =
        (Number(request.params.page) - 1) * Number(request.params.limit);
      const query = await SystemDataSource.manager
        .createQueryBuilder(Contacts, 'contacts')
        .leftJoin('contacts.user', 'user');
      const builtQuery = await this.queryBuilder(request.params, query);
      const summation_query = new SelectQueryBuilder(builtQuery);
      const summation = await summation_query
        .select('COUNT(contacts.contact_id)', 'count')
        .getRawOne();
      const contacts: any = await builtQuery
        .orderBy('contacts.contact_id', 'DESC')
        .where('user.user_id= :user_id', {
          user_id: request.query.user,
        })
        .skip(request.params.page && request.params.limit ? skippedItems : 0)
        .take(
          request.params.page && request.params.limit
            ? parseInt(request.params.limit)
            : 10,
        )
        .getMany();
      const response = [];
      for (const contact of contacts) {
        contact['name'] = this.utils.decryptData(contact.name);
        contact['phone_number'] = this.utils.decryptData(contact.phone_number);
        response.push(contact);
      }
      return {
        metadata: {
          page: Number(request.params.page) || 1,
          items:
            Number(request.params.page) && Number(request.params.limit)
              ? Math.min(Number(request.params.limit), Number(contacts.length))
              : Math.min(Number(contacts.length), 10),
          total: Number(summation.count),
        },
        data: response,
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async updateContact(request: Request) {
    try {
      const contact = request.params?.['contact'];
      const contactPatch: Partial<Contacts> = request.body;
      const encryptedData = {};
      for (const key in contactPatch) {
        if (contactPatch.hasOwnProperty(key)) {
          const value = contactPatch[key];
          const encryptedValue = this.utils.encryptData(value);
          encryptedData[key] = encryptedValue;
        }
      }
      console.log(encryptedData);
      const update = await SystemDataSource.manager.update(
        Contacts,
        {
          contact_id: contact,
        },
        encryptedData,
      );
      if (update.affected != 1) {
        throw new Error('Update failed');
      }
      return {
        statusCode: 200,
        description: 'Contact updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteContact(request: Request) {
    try {
      const delResult = await SystemDataSource.manager.delete(Contacts, {
        contact_id: request.params.contact,
      });
      if (delResult.affected == 1) {
        return {
          statusCode: 200,
          description: `Contact ${request.params.contact} deleted successfully`,
        };
      }
      throw new Error('Contact could not be deleted');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async fetchContact(request: Request) {
    try {
      const cid = request.params.contact;
      const contact = await SystemDataSource.manager
        .createQueryBuilder(Contacts, 'contact')
        .leftJoin('contact.user', 'user')
        .where('contact.contact_id= :contact_id', {
          contact_id: cid,
        })
        .andWhere('user.user_id= :user_id', {
          user_id: request.query.user,
        })
        .getOne();
      if (!contact) {
        throw new Error('No contact info found');
      }
      contact['name'] = this.utils.decryptData(contact.name);
      contact['phone_number'] = this.utils.decryptData(contact.phone_number);
      return contact;
    } catch (error) {
      throw new NotFoundException('No contact info found');
    }
  }

  async queryBuilder(params, query) {
    return query;
  }
}
