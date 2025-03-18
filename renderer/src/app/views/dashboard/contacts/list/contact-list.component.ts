import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableComponent } from "./table/table.component";

@Component({
    selector: 'app-contact-list',
    standalone: true,
    templateUrl: './contact-list.component.html',
    styleUrl: './contact-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TableComponent]
})
export class ContactListComponent {
}
