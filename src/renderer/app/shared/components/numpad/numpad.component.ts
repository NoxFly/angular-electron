import { KeyValuePipe, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, input, Input, OnDestroy, OnInit, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

type NumpadAction = {
    value: string;
    caption?: string;
} & ({
    type: 'number';
} | {
    type: 'action';
    handler: () => void;
});

@Component({
    selector: 'app-numpad',
    standalone: true,
    templateUrl: './numpad.component.html',
    styleUrl: './numpad.component.scss',
    imports: [FormsModule, NgFor, KeyValuePipe],

})
export class NumpadComponent implements OnInit, OnDestroy {
    public disabled = input<boolean>(false);
    public type = input<'text' | 'password'>('text');

    @Input()
    public set decimal(value: boolean | '') {
        if(value !== false) {
            this.actions.set('.', { type: 'action', value: 'dot', caption: ',', handler: this.placeDot.bind(this) });
        }
        else {
            this.actions.delete('.');
        }

        this.acceptDecimals.set(value !== false);
    }

    @Input()
    public set negative(value: boolean | '') {
        if(value !== undefined) {
            this.actions.set('-', { type: 'action', value: 'negative', caption: '-', handler: this.placeMinus.bind(this) });
        }
        else {
            this.actions.delete('-');
        }

        this.acceptNegative.set(value !== undefined);
    }


    public confirm = output<string>();

    protected actionsContainer = viewChild<HTMLElement>('actionsContainer');


    protected value: string = '';
    protected actions: Map<string, NumpadAction> = new Map<string, NumpadAction>();
    protected acceptDecimals = signal(false);
    protected acceptNegative = signal(false);

    protected isNegative = signal(false);


    constructor(
        private readonly cdr: ChangeDetectorRef,
    ) {}

    /* Code-Behind Events */

    protected onKeydown(event: KeyboardEvent): void {
        if(this.disabled()) {
            return;
        }

        const pad = this.actions.get(event.key);

        if(!pad) {
            return;
        }

        const keypad = this.getActionElement(pad.value);

        if(keypad) {
            keypad.classList.add('active');
        }

        this.onAction(pad);

        this.cdr.markForCheck();
    }

    protected onKeyUp(event: KeyboardEvent): void {
        if(this.disabled()) {
            return;
        }

        const pad = this.actions.get(event.key);

        if(!pad) {
            return;
        }

        const keypad = this.getActionElement(pad.value);

        if(keypad) {
            keypad.classList.remove('active');
        }

        this.cdr.markForCheck();
    }

    protected onAction(action: NumpadAction): void {
        if(this.disabled()) {
            return;
        }

        if(action.type === 'number') {
            this.value += action.value;
        }
        else if(action.type === 'action') {
            action.handler();
        }
    }


    /* Custom Actions */

    private onConfirm(): void {
        if(this.disabled() || this.value.length === 0) {
            return;
        }

        this.confirm.emit(this.getParsedValue());
    }

    private clear(): void {
        if(this.disabled()) {
            return;
        }

        this.value = '';
    }

    private deleteCharacter(): void {
        if(this.disabled()) {
            return;
        }

        this.value = this.value.slice(0, -1);
    }

    private placeDot(): void {
        // check if a dot is not already placed in the value
        // or if the value is empty
        if(this.disabled() || !this.acceptDecimals() || this.value.length === 0 || this.value.indexOf(',') !== -1) {
            return;
        }

        this.value += this.actions.get('.')!.caption;
    }

    private placeMinus(): void {
        this.isNegative.update((value) => !value);
    }



    /*  */

    private getActionElement(actionValue: string): HTMLElement | undefined | null {
        return this.actionsContainer()?.querySelector(`button[data-value="${actionValue}"]`);
    }

    private getParsedValue(): string {
        const sign = this.isNegative() ? '-' : '';
        const value = this.value.replace(',', '.');
        return `${sign}${value}`;
    }


    /* NG */

    public ngOnDestroy(): void {
        document.removeEventListener('keydown', this.onKeydown.bind(this));
        document.removeEventListener('keyup', this.onKeyUp.bind(this));
    }

    public ngOnInit(): void {
        document.addEventListener('keydown', this.onKeydown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        this.actions.set('0', { type: 'number', value: '0' });
        this.actions.set('1', { type: 'number', value: '1' });
        this.actions.set('2', { type: 'number', value: '2' });
        this.actions.set('3', { type: 'number', value: '3' });
        this.actions.set('4', { type: 'number', value: '4' });
        this.actions.set('5', { type: 'number', value: '5' });
        this.actions.set('6', { type: 'number', value: '6' });
        this.actions.set('7', { type: 'number', value: '7' });
        this.actions.set('8', { type: 'number', value: '8' });
        this.actions.set('9', { type: 'number', value: '9' });
        this.actions.set('Backspace', { type: 'action', value: 'delete', caption: '', handler: this.deleteCharacter.bind(this) });
        this.actions.set('Enter', { type: 'action', value: 'confirm', caption: '', handler: this.onConfirm.bind(this) });
        this.actions.set('_', { type: 'action', value: 'clear', caption: 'CE', handler: this.clear.bind(this) });
    }
}
