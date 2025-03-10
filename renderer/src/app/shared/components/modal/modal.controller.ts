import { Injectable } from "@angular/core";
import { UIController } from "src/app/shared/directives/UIComponent.directive";
import { ModalConfig } from "src/app/shared/types/ui.types";
import { ModalComponent } from "./modal.component";


@Injectable({
    providedIn: 'root'
})
export class ModalController extends UIController<ModalComponent, ModalConfig> {
    public override create(config: ModalConfig): ModalComponent {
        return this.instanciate(ModalComponent, config);
    }
}
