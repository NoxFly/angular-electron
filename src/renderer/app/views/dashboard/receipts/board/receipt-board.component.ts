import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-receipt-board',
    standalone: true,
    templateUrl: './receipt-board.component.html',
    styleUrl: './receipt-board.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ReceiptBoardComponent {
}
