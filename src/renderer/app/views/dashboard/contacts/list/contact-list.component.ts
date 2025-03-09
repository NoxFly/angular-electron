import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-contact-list',
    standalone: true,
    templateUrl: './contact-list.component.html',
    styleUrl: './contact-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ContactListComponent {
}
