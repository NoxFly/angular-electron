import { Injectable } from "@angular/core";
import { UIController } from "src/app/shared/directives/UIComponent.directive";
import { ToastConfig } from "src/app/shared/types/ui.types";
import { ToastComponent } from "./toast.component";


@Injectable({
    providedIn: 'root'
})
export class ToastController extends UIController<ToastComponent, ToastConfig> {
    public override create(config: ToastConfig): ToastComponent {
        return this.instanciate(ToastComponent, config);
    }
}
