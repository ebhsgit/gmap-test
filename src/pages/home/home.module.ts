import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CustomMarkerHtmlWindowComponent } from "./custom-marker-html-window/custom-marker-html-window";
import { HomePage } from './home';

@NgModule({
    declarations: [
        HomePage,
        CustomMarkerHtmlWindowComponent,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
    ],
    entryComponents: [
        CustomMarkerHtmlWindowComponent
    ]
})
export class HomePageModule { }