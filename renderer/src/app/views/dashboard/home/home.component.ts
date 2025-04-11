import { NgIf } from '@angular/common';
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
    imports: [NgIf],
})
export class HomeComponent implements AfterViewInit {
    protected title = 'Electron Angular';
    protected isSyncing = signal(false);

    protected secondScreenStateMessage = computed(() => {
        return this.electron.hasSecondScreen()
            ? 'Second screen detected'
            : 'No second screen detected';
    });

    protected barChart = viewChild<ElementRef<HTMLCanvasElement>>('barChart');
    protected barChartInstance!: Chart;

    protected lineChart = viewChild<ElementRef<HTMLCanvasElement>>('lineChart');
    protected lineChartInstance!: Chart;

    protected donutChart = viewChild<ElementRef<HTMLCanvasElement>>('donutChart');
    protected donutChartInstance!: Chart;

    protected polarChart = viewChild<ElementRef<HTMLCanvasElement>>('polarChart');
    protected polarChartInstance!: Chart;

    protected radarChart = viewChild<ElementRef<HTMLCanvasElement>>('radarChart');
    protected radarChartInstance!: Chart;


    constructor(
        protected readonly globalState: GlobalStateService,
        protected readonly alertCtrl: AlertController,
        protected readonly modalCtrl: ModalController,
        protected readonly electron: ElectronService,
    ) { }

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

        this.barChartInstance = new Chart(this.barChart()!.nativeElement, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        this.lineChartInstance = new Chart(this.lineChart()!.nativeElement, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                }]
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
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    hoverBackgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });

        this.polarChartInstance = new Chart(this.polarChart()!.nativeElement, {
            type: 'polarArea',
            data: {
                labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
                datasets: [{
                    label: '# of Votes',
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(201, 203, 207, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });

        this.radarChartInstance = new Chart(this.radarChart()!.nativeElement, {
            type: 'radar',
            data: {
                labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: [65, 59, 90, 81, 56, 55, 40]
                }, {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: [28, 48, 40, 19, 96, 27, 100]
                }]
            },
            options: {
                responsive: true
            }
        });
    }
}
