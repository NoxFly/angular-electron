import { Component, input } from '@angular/core';

@Component({
    selector: 'app-saas-registration',
    standalone: true,
    imports: [],
    templateUrl: './saas.component.html',
    styleUrl: './saas.component.scss'
})
export class SaasRegistrationComponent {
    public config = input.required<any>();
}
