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
                    title: 'Accueil',
                    icon: 'a',
                    path: '/dashboard',
                },
                {
                    title: 'Se connecter',
                    icon: 'j',
                    path: '/dashboard/login',
                    caption: 'Se connecter',
                    visible: () => !this.globalState.connected(),
                },
                {
                    title: 'Changer d\'utilisateur',
                    icon: 'j',
                    path: '/dashboard/logout',
                    caption: 'John Doe',
                    visible: () => this.globalState.connected(),
                    handler: (i) => this.onDisconnect(i),
                },
            ],
            [
                {
                    title: 'Tickets',
                    icon: 'h',
                    path: '/dashboard/receipts',
                    disabled: () => !this.globalState.connected(),
                },
                {
                    title: 'Articles',
                    icon: 'd',
                    path: '/dashboard/articles',
                    disabled: () => !this.globalState.connected(),
                },
                {
                    title: 'Contacts',
                    icon: 'f',
                    path: '/dashboard/contacts',
                    disabled: () => !this.globalState.connected(),
                },
                {
                    title: 'Devis',
                    icon: 'g',
                    path: '/dashboard/quotes',
                    disabled: () => !this.globalState.connected(),
                    visible: () => this.globalState.connected(),
                },
            ],
            [
                {
                    title: 'Caisse',
                    icon: 'l',
                    path: '/dashboard/cash',
                    disabled: () => !this.globalState.connected(),
                },
                {
                    title: 'Paramètres',
                    icon: 'i',
                    path: '/dashboard/settings',
                },
            ],
        ];
    }

    private onDisconnect(item: NavItem): void {
        const alert = this.alertCtrl.create({
            title: 'Déconnexion',
            message: 'Souhaitez-vous vraiment vous déconnecter ?',
            actions: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                },
                {
                    text: 'Déconnexion',
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
