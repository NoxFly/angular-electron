import { Injectable } from "@angular/core";
import { UIController } from "../../directives/UIComponent.directive";
import { ModalConfig } from "../../types/ui.types";
import { ModalComponent } from "./modal.component";


@Injectable({
    providedIn: 'root'
})
export class ModalController extends UIController<ModalComponent, ModalConfig> {
    public override create(config: ModalConfig): ModalComponent {
        return this.instanciate(ModalComponent, config, (instance) => {
            instance.component      = config.component;
            instance.componentProps = config.componentProps     || {};
            instance.showBackdrop   = config.showBackdrop       || true;
            instance.showDots       = config.showDots           || true;
            instance.backdropClose  = config.backdropClose      || true;
            instance.keyboardClose  = config.keyboardClose      || true;
        });
    }
}
