import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-quote-list',
    standalone: true,
    templateUrl: './quote-list.component.html',
    styleUrl: './quote-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class QuoteListComponent {
}
