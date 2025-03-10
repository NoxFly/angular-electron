import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, OnInit, computed, effect, input, output, signal } from '@angular/core';

@Component({
    selector: 'app-select-option',
    standalone: true,
    templateUrl: './select-option.component.html',
    styleUrls: ['./select-option.component.scss'],
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent {
    public value = input.required<any>();
    public icon = input<string>();
    public default = input<boolean|''>(false);

    public disabled = input<boolean|''>(false);
    public hidden = input<boolean|''>(false);

    public selected = signal<boolean>(false);

    @HostListener('click')
    public onClick(): void {
        this.optionSelected.emit(this);
    }


    @HostBinding('class.disabled')
    public isDisabled: boolean = false;

    @HostBinding('class.hidden')
    public isHidden: boolean = false;

    @HostBinding('class.selected')
    public isSelected = false;


    public optionSelected = output<SelectOptionComponent>();

    public content = computed(() => this.elementRef.nativeElement.textContent || '');
    public isDefaultSelected = computed(() => this.default() !== false);


    constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
    ) {
        effect(() => this.isDisabled = this.disabled() !== false);
        effect(() => this.isHidden = this.hidden() !== false);
        effect(() => this.isSelected = this.selected());
    }
}
