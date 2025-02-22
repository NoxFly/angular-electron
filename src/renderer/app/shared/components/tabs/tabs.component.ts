import { NgFor } from '@angular/common';
import { AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, ContentChildren, createComponent, ElementRef, HostBinding, Input, OnInit, QueryList, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabComponent } from './tab/tab.component';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.scss',
    standalone: true,
    imports: [NgFor, RouterOutlet],
})
export class TabsComponent implements OnInit, AfterViewInit {
    @Input()
    public type: 'tabs' | 'pivot' = 'pivot';

    @ContentChildren(TabComponent)
    protected tabs!: QueryList<TabComponent>;

    @ViewChild('content', { static: true, read: ElementRef })
    protected content!: ElementRef<HTMLElement>;

    @HostBinding('class.tabs')
    public get typeClass(): boolean {
        return this.type === 'tabs';
    }

    protected isActive(index: number): boolean {
        return index === this.activeTabIndex;
    }

    protected activeTabIndex: number = -1;

    protected selectTab(index: number): void {
        const newActiveTab = this.tabs.get(index);
        const oldActiveTab = this.tabs.get(this.activeTabIndex);

        if(!newActiveTab || newActiveTab.disabled || index === this.activeTabIndex) {
            return;
        }

        this.activeTabIndex = index;

        if(oldActiveTab) {
            const oldElement = this.content.nativeElement.querySelector(`[data-tab-id="${oldActiveTab.getId()}"]:not(.old)`);
            console.log(oldActiveTab, oldElement);
            oldElement?.classList.add('old');
            oldElement?.setAttribute('tabindex', '-1');
            oldElement?.addEventListener('animationend', () => {
                console.log('removing', oldElement);
                oldElement?.remove();
            }, { once: true });
        }

        const newComponent = createComponent(newActiveTab.component, { environmentInjector: this.appRef.injector });
        const newElement = newComponent.location.nativeElement as HTMLElement;

        const newElementWrapper = this.renderer.createElement('div');
        
        this.renderer.addClass(newElementWrapper, 'tab-content');
        this.renderer.setAttribute(newElementWrapper, 'tabindex', '0');
        this.renderer.setAttribute(newElementWrapper, 'data-tab-id', newActiveTab.getId());
        this.renderer.appendChild(newElementWrapper, newElement);

        this.renderer.appendChild(this.content.nativeElement, newElementWrapper);
        this.appRef.attachView(newComponent.hostView);

        this.cdr.detectChanges();
    }

    constructor(
        private readonly appRef: ApplicationRef,
        private readonly cdr: ChangeDetectorRef,
        private readonly renderer: Renderer2,
    ) {}

    public ngAfterViewInit(): void {
        const defaultTabIndex = this.tabs.toArray().findIndex((tab) => tab.default);
        const index = defaultTabIndex > -1 ? defaultTabIndex : 0;
        this.selectTab(index);
    }
    
    public ngOnInit(): void {
    }

}