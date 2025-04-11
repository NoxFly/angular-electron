import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { faker } from '@faker-js/faker';
import { Cell, ColumnDef, createAngularTable, FlexRender, getCoreRowModel, Header, HeaderGroup, Row } from '@tanstack/angular-table';
import { map, Observable, of, tap } from 'rxjs';
import { Civility, Contact } from 'src/app/core/models/Contact';
import { SubscriptionManager } from 'src/app/shared/directives/SubscriptionManager.directive';

@Component({
    selector: 'app-table',
    standalone: true,
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgFor, NgIf, FlexRender],
})
export class TableComponent extends SubscriptionManager implements OnInit {
    protected data = signal<Contact[]>([]);

    protected defaultColumns: ColumnDef<Contact>[] = [
        {
            header: 'Number',
            accessorKey: 'number',
        },
        {
            header: 'Name',
            cell: info => {
                const contact = info.row.original as Contact;
                
                return contact.civility === Civility.Society
                    ? contact.companyName
                    : `${contact.lastName} ${contact.firstName}`;
            },
        },
        {
            header: 'Zip code',
            accessorKey: 'postalCode',
        },
        {
            header: 'City',
            accessorKey: 'city',
        },
        {
            header: 'Country',
            accessorKey: 'country',
        },
        {
            header: 'Customer price group',
            accessorKey: 'customerPriceGroup',
        },
        {
            header: 'Customer discount group',
            accessorKey: 'customerDiscountGroup',
        },
        {
            header: 'Customer payment terms',
            accessorKey: 'customerPaymentTerms',
        },
        {
            header: 'Customer VAT group',
            accessorKey: 'customerVatGroup',
        },
        {
            header: 'Customer delivery terms',
            accessorKey: 'customerDeliveryTerms',
        },
        {
            header: 'Customer delivery method',
            accessorKey: 'customerDeliveryMethod',
        },
        {
            header: 'Delivery address',
            accessorKey: 'customerDeliveryAddress',
        },
        {
            header: 'Delivery city',
            accessorKey: 'customerDeliveryCity',
        },
        {
            header: 'Delivery zip code',
            accessorKey: 'customerDeliveryPostalCode',
        },
        {
            header: 'Delivery country',
            accessorKey: 'customerDeliveryCountry',
        },
        {
            header: 'Delivery contact',
            accessorKey: 'customerDeliveryContact',
        }
    ];

    protected table = createAngularTable(() => ({
        data: this.data(),
        columns: this.defaultColumns,
        getCoreRowModel: getCoreRowModel(),
    }));

    protected headerGroupTrackBy(index: number, group: HeaderGroup<Contact>): string {
        return group.id;
    }

    protected headerTrackBy(index: number, column: Header<Contact, unknown>): string {
        return column.id;
    }

    protected rowTrackBy(index: number, row: Row<Contact>): string {
        return row.id;
    }

    protected cellTrackBy(index: number, cell: Cell<Contact, unknown>): string {
        return cell.id;
    }

    public loadContacts(): Observable<void> {
        return of(1000).pipe(
            tap(n => {
                const contacts: Contact[] = Array(n).fill(null).map((_, i) => ({
                    number: "CT" + faker.number.int(),
                    civility: faker.helpers.arrayElement([Civility.Mr, Civility.Mrs, Civility.Society]),
                    companyName: faker.company.name(),
                    lastName: faker.person.lastName(),
                    firstName: faker.person.firstName(),
                    postalCode: faker.location.zipCode(),
                    city: faker.location.city(),
                    country: faker.location.country(),
                    customerPriceGroup: faker.commerce.department(),
                    customerDiscountGroup: faker.commerce.department(),
                    customerPaymentTerms: faker.finance.transactionType(),
                    customerVatGroup: faker.finance.accountName(),
                    customerDeliveryTerms: faker.commerce.productAdjective(),
                    customerDeliveryMethod: faker.commerce.productMaterial(),
                    customerDeliveryAddress: faker.location.streetAddress(),
                    customerDeliveryCity: faker.location.city(),
                    customerDeliveryPostalCode: faker.location.zipCode(),
                    customerDeliveryCountry: faker.location.country(),
                    customerDeliveryContact: faker.phone.number(),
                }));

                this.data.set(contacts);
            }),
            map(() => void 0),
        );
    }

    public ngOnInit(): void {
        this.watch$ = this.loadContacts();
    }
}
