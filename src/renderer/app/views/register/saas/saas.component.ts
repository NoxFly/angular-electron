import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-saas-registration',
    standalone: true,
    imports: [],
    templateUrl: './saas.component.html',
    styleUrl: './saas.component.scss'
})
export class SaasRegistrationComponent {
    @Input({ required: true })
    public config: any;
}
