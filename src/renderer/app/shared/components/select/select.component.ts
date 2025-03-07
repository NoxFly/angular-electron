import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChildren, input, OnInit } from '@angular/core';
import { SelectOptionComponent } from './select-option/select-option.component';



@Component({
    selector: 'app-select',
    standalone: true,
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    imports: [NgFor, NgIf, SelectOptionComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnInit {
    public placeholder  = input<string>('Sélectionnez une option');
    public multiple     = input<boolean>();
    public selected     = input<any | any[]>();
    public search       = input<boolean>();
    public clearable    = input<boolean>();

    public options      = contentChildren(SelectOptionComponent);

    protected getSelectedText(): string {
        return this.placeholder();
    }

    protected get hasSelected(): boolean {
        return this.selected !== undefined && (
            !this.multiple || (this.selected() as any[]).length > 0
        );
    }

    public ngOnInit(): void {

    }
}
