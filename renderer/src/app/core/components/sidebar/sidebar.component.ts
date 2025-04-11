import { DatePipe, Location, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GlobalStateService } from 'src/app/core/services/globalState.service';
import { AlertController } from 'src/app/shared/components/alert/alert.controller';


type NavItem = {
    title: string;
    icon: string;
    path: string;
    caption?: string;
    disabled?: () => boolean;
    visible?: () => boolean;
    handler?: (i: NavItem) => void;
};

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    imports: [NgIf, NgFor, RouterLink, DatePipe],
})
export class SidebarComponent implements OnInit {
    protected sidebarItems: NavItem[][] = [];
    protected today: Date = new Date();
    protected currentPath: string = '';

    constructor(
        private readonly globalState: GlobalStateService,
        private readonly location: Location,
        private readonly router: Router,
        private readonly cdr: ChangeDetectorRef,
        private readonly alertCtrl: AlertController,
    ) {
        this.router.events.subscribe(() => {
            this.currentPath = this.location.path();
            this.cdr.detectChanges();
        });
    }

    public ngOnInit(): void {
        this.sidebarItems = [
            [
                {
                    title: 'Home',
                    icon: 'home.png',
                    path: '/dashboard',
                },
                {
                    title: 'Login',
                    icon: 'key.png',
                    path: '/dashboard/login',
                    caption: 'Login',
                    visible: () => !this.globalState.connected(),
                },
                {
                    title: 'Change user',
                    icon: 'key.png',
                    path: '/dashboard/logout',
                    caption: 'John Doe',
                    visible: () => this.globalState.connected(),
                    handler: (i) => this.onDisconnect(i),
                },
            ],
            [
                {
                    title: 'Receipts',
                    icon: 'receipt.png',
                    path: '/dashboard/receipts',
                    disabled: () => !this.globalState.connected(),
                },
                {
                    title: 'Items',
                    icon: 'items.png',
                    path: '/dashboard/items',
                    disabled: () => !this.globalState.connected(),
                },
                {
                    title: 'Contacts',
                    icon: 'people.png',
                    path: '/dashboard/contacts',
                    disabled: () => !this.globalState.connected(),
                },
                {
                    title: 'Estimates',
                    icon: 'estimation.png',
                    path: '/dashboard/quotes',
                    disabled: () => !this.globalState.connected(),
                    visible: () => this.globalState.connected(),
                },
            ],
            [
                {
                    title: 'Cash Register',
                    icon: 'cash-register.png',
                    path: '/dashboard/cash',
                    disabled: () => !this.globalState.connected(),
                },
                {
                    title: 'Settings',
                    icon: 'settings.png',
                    path: '/dashboard/settings',
                },
            ],
        ];
    }

    private async onDisconnect(item: NavItem): Promise<void> {
        const alert = await this.alertCtrl.create({
            title: 'Disconnect',
            message: 'Do you really want to disconnect ?',
            actions: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Disconnect',
                    role: 'destructive',
                    handler: () => {
                        this.router.navigateByUrl(item.path);
                        alert.dismiss();
                    },
                },
            ],
        });
    }
}
