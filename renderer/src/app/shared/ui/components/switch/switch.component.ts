/**
 * @copyright Dorian Thivolle
 * @license MIT
 * @see https://github.com/NoxFly
 */

import { Component, ElementRef, forwardRef, HostBinding, input, model, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { randomId } from 'src/app/shared/helpers/utils';

@Component({
    selector: 'ui-switch',
    standalone: true,
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SwitchComponent),
            multi: true
        }
    ],
})
export class SwitchComponent implements ControlValueAccessor {
    public label = input<string | undefined>(undefined);
    public value = model<boolean>(false);
    public disabled = model<boolean>(false);

    protected id = randomId();

    protected readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('input');

    @HostBinding('class.has-focus')
    protected hasFocus: boolean = false;

    // ---

    protected toggle(): void {
        if(this.disabled()) {
            return;
        }

        const newValue = !this.value();

        this.valueChanged(newValue);
        this.inputElement().nativeElement.checked = newValue;
    }

    // ---

    public onChange = (value: any): void => {};
    public onTouched = (): void => {};

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // ---

    public writeValue(value: any): void {
        this.value.set(value);
    }

    public valueChanged(value: boolean): void {
        this.onChange(value);
        this.value.set(value);
    }

    public handleInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.value.set(input.checked);
        this.onChange(this.value());
    }

    public handleBlur(): void {
        this.hasFocus = false;
        this.onTouched();
    }

    public handleFocus(): void {
        this.hasFocus = true;
        this.onTouched();
    }


    // ---

    public setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    public setFocus(): void {
        this.inputElement().nativeElement.focus();
    }
}
