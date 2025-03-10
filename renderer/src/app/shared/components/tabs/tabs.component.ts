import { NgFor } from '@angular/common';
import { AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, ComponentRef, contentChildren, createComponent, ElementRef, HostBinding, input, OnInit, Renderer2, viewChild } from '@angular/core';
import { TabComponent } from './tab/tab.component';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.scss',
    standalone: true,
    imports: [NgFor],
})
export class TabsComponent implements OnInit, AfterViewInit {
    public type = input<'tabs' | 'pivot'>('pivot');

    protected tabs = contentChildren<TabComponent>(TabComponent);

    protected content = viewChild<ElementRef<HTMLElement>>('content');

    @HostBinding('class.tabs')
    public get typeClass(): boolean {
        return this.type() === 'tabs';
    }

    protected isActive(index: number): boolean {
        return index === this.activeTabIndex;
    }

    protected activeTabIndex: number = -1;

    private readonly instances = new Map<number, { ref: ComponentRef<any>; container: HTMLElement }>();


    protected selectTab(index: number): void {
        const oldIndex = this.activeTabIndex;
        const newActiveTab = this.tabs()[index];
        const vec = Math.sign(index - oldIndex);

        if(!newActiveTab || newActiveTab.disabled() || index === oldIndex) {
            return;
        }

        this.leaveTab(oldIndex, vec);
        this.enterTab(index, vec);

        this.cdr.detectChanges();
    }

    constructor(
        private readonly appRef: ApplicationRef,
        private readonly cdr: ChangeDetectorRef,
        private readonly renderer: Renderer2,
    ) {}


    /**
     *
     */
    private leaveTab(index: number, vec: number): void {
        const oldActiveTab = this.tabs()[index];

        if(!oldActiveTab || !this.instances.has(index)) {
            return;
        }

        const old = this.instances.get(index)!;
        const oldElement = old.container;

        this.renderer.addClass(oldElement, 'old');
        this.renderer.setAttribute(oldElement, 'data-vec', vec < 0 ? 'right-to-left' : 'left-to-right');
        this.renderer.setAttribute(oldElement, 'tabindex', '-1');

        oldElement?.addEventListener('animationend', () => {
            this.renderer.removeClass(oldElement, 'old');
            this.appRef.detachView(old.ref.hostView);
            oldElement?.remove();
        }, { once: true });
    }

    /**
     *
     */
    private enterTab(index: number, vec: number): void {
        const newActiveTab = this.tabs()[index]!;

        let newComponent: ComponentRef<any>;
        let newElementWrapper: HTMLElement;

        // déjà visité auparavant (sur la même page)
        if(this.instances.has(index)) {
            const niew = this.instances.get(index)!;
            newComponent = niew.ref;
            newElementWrapper = niew.container;
        }
        // création d'une nouvelle instance car 1ère fois visite de cet onglet
        else {
            newComponent = createComponent(newActiveTab.component(), { environmentInjector: this.appRef.injector });
            newElementWrapper = this.renderer.createElement('div');

            this.renderer.addClass(newElementWrapper, 'tab-content');
            this.instances.set(index, { ref: newComponent, container: newElementWrapper });
        }

        const newElement = newComponent.location.nativeElement as HTMLElement;
        this.renderer.appendChild(newElementWrapper, newElement);

        this.renderer.setAttribute(newElementWrapper, 'data-vec', vec < 0 ? 'left-to-right' : 'right-to-left');
        this.renderer.setAttribute(newElementWrapper, 'tabindex', '0');

        this.renderer.addClass(newElementWrapper, 'new');

        newElementWrapper.addEventListener('animationend', () => {
            this.renderer.removeClass(newElementWrapper, 'new');
        }, { once: true });

        this.renderer.appendChild(this.content()?.nativeElement, newElementWrapper);
        this.appRef.attachView(newComponent.hostView);

        this.activeTabIndex = index;
    }


    public ngAfterViewInit(): void {
        const defaultTabIndex = this.tabs().findIndex((tab) => tab.default);
        const index = defaultTabIndex > -1 ? defaultTabIndex : 0;
        this.selectTab(index);
    }

    public ngOnInit(): void {
    }

}
