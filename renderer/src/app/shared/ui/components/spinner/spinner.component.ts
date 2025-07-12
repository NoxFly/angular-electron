/**
 * @copyright Dorian Thivolle
 * @license MIT
 * @see https://github.com/NoxFly
 */

import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { UIColor } from 'src/app/shared/ui/ui.types';

@Component({
    selector: 'ui-spinner',
    standalone: true,
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SpinnerComponent {
    public color = input<UIColor>('default');
}
