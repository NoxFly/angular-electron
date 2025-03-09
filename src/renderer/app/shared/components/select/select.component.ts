import { ChangeDetectionStrategy, Component, computed, contentChildren, effect, HostBinding, input, OnInit, signal } from '@angular/core';
import { SelectOptionComponent } from './select-option/select-option.component';



@Component({
    selector: 'app-select',
    standalone: true,
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnInit {
    public placeholder  = input<string>('Sélectionnez une option');
    public multiple     = input<boolean|''>(false);
    public search       = input<boolean|''>(false);
    public clearable    = input<boolean|''>(false);
    public selected     = input<any|any[]>([]);
    
    public options      = contentChildren(SelectOptionComponent);
    
    protected _selected  = signal<SelectOptionComponent[]>([]);
    protected hasSelected = computed(() => this._selected().length > 0);
    
    protected getSelected = computed(() => {
        if(!this.hasSelected()) {
            return {
                values: [],
                text: this.placeholder(),
            };
        }

        return Array.from(this._selected())
            .map(option => ({
                values: option!.value(),
                text: option!.content(),
            }))
            .reduce((acc, { values, text }) => ({
                values: [...acc.values, values],
                text: acc.text ? `${acc.text}, ${text}` : text,
            }), { values: [], text: '' });
    });


    @HostBinding('class.opened')
    public opened: boolean = false;

    @HostBinding('class.multiple')
    public get isMultiple(): boolean {
        return this.multiple() !== false;
    }

    constructor() {
        effect(() => {
            for(const opt of this._selected()) {
                opt.selected.set(true);
            }
        }, { allowSignalWrites: true });
    }

    protected toggleOptions(): void {
        this.opened = !this.opened;
    }

    private onOptionSelected(option: SelectOptionComponent): void {
        if(option.disabled()) {
            return;
        }

        if(this.isMultiple) {
            const selected = this._selected();

            if(selected.includes(option)) {
                if(selected.length < 2) {
                    return;
                }

                option.selected.set(false);
                this._selected.update(selectedOptions => selectedOptions.filter(selectedOption => selectedOption !== option));
            }
            else {
                this._selected.set([...selected, option]);
            }
        }

        else {
            this.opened = false;
            this._selected()[0]?.selected.set(false);
            this._selected.set([option]);
        }
    }

    public ngOnInit(): void {
        const defaultSelection: SelectOptionComponent[] = [];
        const selected: SelectOptionComponent[] = [];

        const hasOptionSelected = this.selected() !== undefined && this.selected() !== null && this.selected().length > 0;

        this.options().forEach(option => {
            option.optionSelected.subscribe(this.onOptionSelected.bind(this));

            if(option.isDefaultSelected()) {
                defaultSelection.push(option);
            }

            if(hasOptionSelected) {
                if(this.isMultiple) {
                    if(this.selected().includes(option.value())) {
                        selected.push(option);
                    }
                }
                else {
                    if(this.selected() === option.value()) {
                        selected.push(option);
                    }
                }
            }
        });

        if(hasOptionSelected && selected.length > 0) {
            this._selected.set(selected);
        }
        else if(defaultSelection.length > 0) {
            this._selected.set(defaultSelection);
        }
    }
}
