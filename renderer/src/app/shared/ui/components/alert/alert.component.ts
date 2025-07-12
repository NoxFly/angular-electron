/**
 * @copyright Dorian Thivolle
 * @license MIT
 * @see https://github.com/NoxFly
 */

import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, ElementRef, HostBinding, Inject, input, signal } from '@angular/core';
import { SanitizePipe } from 'src/app/shared/pipes/sanitize.pipe';
import { UIAction } from 'src/app/shared/ui/ui.types';
import { UIComponent } from 'src/app/shared/ui/UIComponent.directive';

@Component({
    selector: 'ui-alert',
    standalone: true,
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    imports: [SanitizePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent extends UIComponent {
    protected readonly defaultActions: UIAction[] = [
        {
            text: 'Ok',
            role: 'cancel',
            handler: (self) => this.dismiss({ role: self.role })
        }
    ];

    public title    = input<string>();
    public message  = input<string>();
    public actions  = input<UIAction[]>(this.defaultActions);
    public details  = input<string>('');

    protected detailsOpened = signal<boolean>(false);
    protected hasActions = computed(() => this.actions().length > 0);
    protected hasDetails = computed(() => this.details().length > 0);

    protected formattedDetails = computed(() => {
        let d = '<pre>';

        d += this.details();

        const regex = /(\{|\[)(\s|\n)*.*(\s|\n)*(\}|\])/g;
        const matches = d.match(regex);

        if(matches) {
            matches.forEach((match) => {
                const beautified = JSON.stringify(JSON.parse(match), null, 4);
                d = d.replace(match, `</pre><code><pre class="code-pre">${beautified}</pre></code><pre>`);
            });
        }

        d += '</pre>';

        return d;
    });


    @HostBinding('class.details-opened')
    public areDetailsOpenedClass = false;

    constructor(
        @Inject(DOCUMENT)
        document: Document,
        appRef: ApplicationRef,
        ref: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
    ) {
        super(document, appRef, ref, cdr);

        effect(() => this.areDetailsOpenedClass = this.detailsOpened());
    }

    protected toggleDetails(): void {
        this.detailsOpened.update((prev) => !prev);
    }
}
