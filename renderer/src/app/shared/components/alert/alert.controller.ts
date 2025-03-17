import { Injectable } from "@angular/core";
import { UIController } from "src/app/shared/directives/UIComponent.directive";
import { AlertConfig } from "src/app/shared/types/ui.types";
import { AlertComponent } from "./alert.component";


@Injectable({
    providedIn: 'root'
})
export class AlertController extends UIController<AlertComponent, AlertConfig> {
    public override async create(config: AlertConfig): Promise<AlertComponent> {
        return this.instanciate(AlertComponent, config);
    }
}
