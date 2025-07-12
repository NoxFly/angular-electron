/**
 * @copyright Dorian Thivolle
 * @license MIT
 * @see https://github.com/NoxFly
 */

import { ChangeDetectionStrategy, Component, effect, ElementRef, input, model, viewChild } from '@angular/core';
import { UIColor } from 'src/app/shared/ui/ui.types';

export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
    selector: 'ui-button',
    standalone: true,
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    public type = input.required<ButtonType>();
    public color = input<UIColor | 'transparent'>('default');
    public disabled = model<boolean>(false);

    protected readonly buttonElement = viewChild.required<ElementRef<HTMLButtonElement>>('button');

    // ---

    constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
    ) {
        effect(() => {
            this.buttonElement().nativeElement.disabled = this.disabled();

            const ref = this.elementRef.nativeElement;

            if(this.disabled()) {
                ref.setAttribute('disabled', 'true');
            }
            else {
                ref.removeAttribute('disabled');
            }
        });
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    public setFocus(): void {
        this.buttonElement().nativeElement.focus();
    }
}
