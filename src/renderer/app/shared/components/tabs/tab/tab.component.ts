import { Component, input, OnInit, Type } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrl: './tab.component.scss',
    standalone: true,
    imports: [],
})
export class TabComponent implements OnInit {
    public component    = input.required<Type<any>>();
    public disabled     = input<boolean>(false);
    public label        = input<string>('');
    public icon         = input<string>('');
    public badge        = input<string>('');
    public badgeColor   = input<string>('');
    public default      = input<boolean>(false);

    public getId(): string {
        return this.id;
    }

    private id: string = '';

    public ngOnInit(): void {
        this.id = uuidv4();
    }

}
