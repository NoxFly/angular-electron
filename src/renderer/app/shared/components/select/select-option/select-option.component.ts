import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, input } from '@angular/core';



@Component({
    selector: 'app-select-option',
    standalone: true,
    templateUrl: './select-option.component.html',
    styleUrls: ['./select-option.component.scss'],
    imports: [NgFor, NgIf],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent implements OnInit {
    public value = input.required<any>();
    public disabled = input<boolean>();
    public hidden = input<boolean>();
    public icon = input<string>();

    public ngOnInit(): void {

    }
}
