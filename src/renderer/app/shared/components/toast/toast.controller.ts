import { Injectable } from "@angular/core";
import { UIController } from "../../directives/UIComponent.directive";
import { ToastConfig } from "../../types/ui.types";
import { ToastComponent } from "./toast.component";


@Injectable({
    providedIn: 'root'
})
export class ToastController extends UIController<ToastComponent, ToastConfig> {
    public override create(config: ToastConfig): ToastComponent {
        return this.instanciate(ToastComponent, config, (instance) => {
            instance.message    = config.message;
            instance.closable   = config.closable   || false;
            instance.color      = config.color      || 'default';
            instance.duration   = config.duration;
            instance.position   = config.position   || 'top-center';
            instance.actions    = config.actions;
        });
    }
}
