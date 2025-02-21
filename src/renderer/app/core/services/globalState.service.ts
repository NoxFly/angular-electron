import { Injectable, signal, WritableSignal } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

type UISettings = {
    showTitlebar: boolean;
    movable: boolean;
    minimizable: boolean;
    maximizable: boolean;
    closable: boolean;
    windowType?: 'primary' | 'secondary';
};

@Injectable({
    providedIn: 'root',
})
export class GlobalStateService {
    public current!: UISettings;
    public default: UISettings;

    public readonly known: WritableSignal<boolean>;
    public readonly connected: WritableSignal<boolean>;

    constructor(
        private readonly router: Router,
    ) {
        this.default = {
            showTitlebar: true,
            movable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            windowType: undefined,
        };

        this.known = signal(false);
        this.connected = signal(false);

        this.resetSettings();

        // subscribe to navigation. Before the new page loads, reset values to default
        this.router.events.subscribe((event) => {
            if(event instanceof NavigationStart) {
                this.resetSettings();
            }
        });
    }

    public resetSettings(): void {
        this.current = JSON.parse(JSON.stringify(this.default));
    }
}
