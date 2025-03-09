import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-receipt-list',
    standalone: true,
    templateUrl: './receipt-list.component.html',
    styleUrl: './receipt-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ReceiptListComponent {
}
