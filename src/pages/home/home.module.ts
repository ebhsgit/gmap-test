import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CustomMarkerHtmlWindowComponentModule } from './custom-marker-html-window/custom-marker-html-window.module';
import { HomePage } from './home';

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        CustomMarkerHtmlWindowComponentModule,
    ],
})
export class HomePageModule { }