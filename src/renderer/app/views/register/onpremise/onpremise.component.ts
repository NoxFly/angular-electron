import { AfterViewInit, Component, ElementRef, EventEmitter, input, Input, OnInit, output, Output, viewChild, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '../../../shared/components/modal/modal.controller';

@Component({
    selector: 'app-onpremise-registration',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './onpremise.component.html',
    styleUrl: './onpremise.component.scss'
})
export class OnpremiseRegistrationComponent implements OnInit, AfterViewInit {
    public config = input.required<any>();

    public readonly registrationCanceled = output<void>();
    public readonly registrationConfirmed = output<any>();

    protected username = viewChild<HTMLInputElement>('username');

    protected form!: FormGroup;


    constructor(
        private readonly modalCtrl: ModalController,
    ) {}


    protected cancelRegistration(): void {
        this.modalCtrl.dismiss({ role: 'cancel' });
    }

    protected confirmRegistration(): void {
        if(this.form.invalid) {
            return;
        }

        this.modalCtrl.dismiss({ role: 'confirm', data: this.config });
    }

    public ngAfterViewInit(): void {
        this.username()?.focus();
    }

    public ngOnInit(): void {
        this.form = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });
    }

}
