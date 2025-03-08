import { ChangeDetectionStrategy, Component, contentChildren, HostBinding, input, OnInit } from '@angular/core';
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
    public multiple     = input<boolean>(false);
    public selected     = input<any | any[]>();
    public search       = input<boolean>(false);
    public clearable    = input<boolean>(false);

    public options      = contentChildren(SelectOptionComponent);


    @HostBinding('class.opened')
    public opened: boolean = false;

    @HostBinding('class.multiple')
    public get isMultiple(): boolean {
        return this.multiple();
    }


    protected getSelectedText(): string {
        return this.placeholder();
    }

    protected get hasSelected(): boolean {
        return this.selected() !== undefined && (
            !this.multiple() || (this.selected() as any[]).length > 0
        );
    }

    protected toggleOptions(): void {
        this.opened = !this.opened;
    }

    public ngOnInit(): void {

    }
}
