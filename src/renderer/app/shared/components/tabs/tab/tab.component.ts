import { Component, Input, OnInit, Type } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrl: './tab.component.scss',
    standalone: true,
    imports: [],
})
export class TabComponent implements OnInit {
    @Input()
    public disabled: boolean = false;

    @Input()
    public label: string = '';

    @Input()
    public icon: string = '';

    @Input()
    public badge: string = '';

    @Input()
    public badgeColor: string = '';

    @Input()
    public default: boolean = false;

    @Input({ required: true })
    public component!: Type<any>;

    public getId(): string {
        return this.id;
    }

    private id: string = '';
    
    public ngOnInit(): void {
        this.id = uuidv4();
    }

}