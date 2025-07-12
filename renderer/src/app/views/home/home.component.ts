import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from 'src/app/shared/ui/components/button/button.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent],
})
export class HomeComponent {
    constructor() {
        console.log('HomeComponent initialized');
    }
}
