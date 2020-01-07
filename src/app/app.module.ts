import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMaps } from "@ionic-native/google-maps";
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MapControllerProvider } from "../providers/map-controller";
import { MyApp } from './app.component';

@NgModule({
	declarations: [
		MyApp,
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp, {
			pageTransition: "md-transition"
		})
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
	],
	providers: [
		GoogleMaps,
		MapControllerProvider,
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule {
}
