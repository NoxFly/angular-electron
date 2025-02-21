import { Injectable } from "@angular/core";
import { UIController } from "../../directives/UIComponent.directive";
import { AlertConfig } from "../../types/ui.types";
import { AlertComponent } from "./alert.component";


@Injectable({
    providedIn: 'root'
})
export class AlertController extends UIController<AlertComponent, AlertConfig> {
    public override create(config: AlertConfig): AlertComponent {
        return this.instanciate(AlertComponent, config, (instance) => {
            instance.title      = config.title;
            instance.message    = config.message;
            instance.actions    = config.actions;
        });
    }
}
