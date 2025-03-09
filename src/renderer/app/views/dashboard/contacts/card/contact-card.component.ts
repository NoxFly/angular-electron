import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-contact-card',
    standalone: true,
    templateUrl: './contact-card.component.html',
    styleUrl: './contact-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ContactCardComponent {
}
