import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ElectronService } from 'src/app/core/services/electron.service';
import { GlobalStateService } from 'src/app/core/services/globalState.service';
import { AlertController } from 'src/app/shared/components/alert/alert.controller';
import { ModalController } from 'src/app/shared/components/modal/modal.controller';
import { SyncLoaderComponent } from 'src/app/shared/components/sync-loader/sync-loader.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class HomeComponent implements AfterViewInit {
    protected title = 'Electron Angular';
    protected isSyncing = signal(false);

    protected secondScreenStateMessage = computed(() => {
        return this.electron.hasSecondScreen()
            ? 'Second screen detected'
            : 'No second screen detected';
    });

    protected lineChart = viewChild<ElementRef<HTMLCanvasElement>>('lineChart');
    protected lineChartInstance!: Chart;

    protected donutChart = viewChild<ElementRef<HTMLCanvasElement>>('donutChart');
    protected donutChartInstance!: Chart;

    constructor(
        protected readonly globalState: GlobalStateService,
        protected readonly alertCtrl: AlertController,
        protected readonly modalCtrl: ModalController,
        protected readonly electron: ElectronService,
    ) {}

    protected async sync(withSuccess: boolean): Promise<void> {
        if(this.isSyncing()) {
            return;
        }

        this.isSyncing.set(true);

        const modal = await this.modalCtrl.create({
            component: SyncLoaderComponent,
            backdropClose: false,
            keyboardClose: false,
            showBackdrop: true,
            showDots: true,
            id: 'sync-modal',
            componentProps: {
                resultSuccess: withSuccess,
            }
        });

        modal.willDismiss.subscribe(() => {
            this.isSyncing.set(false);
        });
    }

    protected printPDF(): void {
        this.electron.ipc.print();
    }

    protected openSecondScreen(): void {
        this.electron.ipc.openSecondScreen();
    }

    protected displayError(): void {
        this.alertCtrl.create({
            title: 'An issue occurred',
            message: 'An error occurred while synchronizing with the API.',
            actions: [
                {
                    text: 'Ok',
                    role: 'cancel',
                },
            ],
            details: `The property 'foo' does not exist on type 'bar'. Make sure to only use property names that are defined by the type.
{"id": 12345,"name": "John Doe","email": "johndoe@example.com","isActive": true,"roles": ["admin", "editor"],"profile": {"age": 29,"gender": "male","address": {"street": "123 Main St","city": "Springfield","state": "IL","zip": "62704"}},"preferences": {"theme": "dark","notifications": {"email": true,"sms": false},"createdAt": "2025-04-11T10:30:00Z","tags": ["random", "json", "example"]}}
`
        });
    }

    public ngAfterViewInit(): void {
        if(!this.globalState.connected()) {
            return;
        }

        Chart.register(...registerables);

        const ctx = this.lineChart()!.nativeElement.getContext('2d')!;
        const gradient = ctx.createLinearGradient(0, 25, 0, 300);
        gradient.addColorStop(0, 'rgba(188, 225, 227, 255)');
        gradient.addColorStop(1, 'rgba(188, 225, 227, 0)');

        this.lineChartInstance = new Chart(this.lineChart()!.nativeElement, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Sales Report',
                    backgroundColor: gradient,
                    pointRadius: 0,
                    borderColor: '#137069',
                    data: [25, 38, 35, 64, 56, 70, 70],
                    tension: .5,
                    fill: true,
                }],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                responsive: true,
                scales: {
                    x: {
                        display: true
                    },
                    y: {
                        display: true
                    }
                }
            }
        });

        this.donutChartInstance = new Chart(this.donutChart()!.nativeElement, {
            type: 'doughnut',
            data: {
                labels: ['Red', 'Blue', 'Yellow'],
                datasets: [{
                    label: '# of Votes',
                    data: [300, 50, 100],
                    backgroundColor: [
                        '#097d76',
                        '#13968e',
                        '#2bb1a8'
                    ],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom', // Move legend to the bottom
                        labels: {
                            usePointStyle: true, // Use dots instead of rectangles
                            pointStyle: 'circle', // Set the shape of the legend to dots
                        },
                    },
                },
            }
        });
    }
}
