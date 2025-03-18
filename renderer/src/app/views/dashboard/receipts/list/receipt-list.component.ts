import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NumpadComponent } from "src/app/shared/components/numpad/numpad.component";

@Component({
    selector: 'app-receipt-list',
    standalone: true,
    templateUrl: './receipt-list.component.html',
    styleUrl: './receipt-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NumpadComponent],
})
export class ReceiptListComponent {
}
