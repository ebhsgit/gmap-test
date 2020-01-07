import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { CustomMarkerHtmlWindowComponent } from "./custom-marker-html-window";

@NgModule({
    declarations: [
        CustomMarkerHtmlWindowComponent,
    ],
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [
        CustomMarkerHtmlWindowComponent,
    ],
    entryComponents: [
        CustomMarkerHtmlWindowComponent,
    ],
})
export class CustomMarkerHtmlWindowComponentModule { }