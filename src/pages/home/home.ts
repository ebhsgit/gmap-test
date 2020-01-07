import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Injector, NgZone } from '@angular/core';
import { GoogleMapOptions, GoogleMapsEvent, HtmlInfoWindow, ILatLng, LatLng, Marker, MarkerOptions, PolylineOptions } from '@ionic-native/google-maps';
import { AlertController, Events, IonicPage, NavController, Platform, ToastController } from 'ionic-angular';
import { MapControllerProvider, MapInstance } from "../../providers/map-controller";
import { CustomMarkerHtmlWindowComponent } from './custom-marker-html-window/custom-marker-html-window';



const CAMERA_DEFAULT_LAT = 65.9667;
const CAMERA_DEFAULT_LONG = -18.5333;
const CAMERA_DEFAULT_ZOOMLEVEL = 13;
const POLYGON_STROKE_COLOR = '#73922a70';
const POLYGON_FILL_COLOR = '#8fbf1c20';
const POLYGON_STROKE_WIDTH = 2;

const mapId = 'HOME_MAP';

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	private hMap: MapInstance;

	htmInfoWindow: HtmlInfoWindow;

	constructor(
		private navCtrl: NavController,
		private events: Events,
		private mapCtrl: MapControllerProvider,
		private toastCtrl: ToastController,
		private alertCtrl: AlertController,
		private platform: Platform,
		private injector: Injector,
		private resolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private _ngZone: NgZone
	) {
		this.setupEventListeners();
	}

	setupEventListeners() {
		console.log('HomePage: setupEventListeners()');
		this.platform.pause.subscribe(() => {
			console.info('Application is in running in the background...');
		});

		this.platform.resume.subscribe(() => {
			console.info('Application is in running in the foreground...');
		});
	}

	ionViewWillLeave() {
		console.log('HomePage: ionViewWillLeave()');
		this.hMap.hide();
		this.events.unsubscribe('MARKER.CLICK', this._handleMarkerClick);
	}

	ionViewDidLoad() {
		console.log('HomePage: ionViewDidLoad()');

		const newMapOptions: GoogleMapOptions = {
			mapType: "MAP_TYPE_NORMAL",
			controls: {
				compass: false,
				myLocation: true,
				myLocationButton: true,
				zoom: true
			},
			gestures: {
				scroll: true,
				tilt: false,
				rotate: true,
				zoom: true
			},
			camera: {
				target: {
					lat: CAMERA_DEFAULT_LAT,
					lng: CAMERA_DEFAULT_LONG
				},
				zoom: CAMERA_DEFAULT_ZOOMLEVEL
			},
			preferences: {
				zoom: {
					minZoom: 10,
					maxZoom: 18
				},
				building: false
			}
		};

		this.hMap = this.mapCtrl.addMap('HOME', 'map_canvas', newMapOptions);
		this.htmInfoWindow = new HtmlInfoWindow();
	}

	ionViewDidEnter() {
		console.log('HomePage: ionViewDidEnter()');
		this.hMap.show();

		this.platform.ready().then(
			() => {
				this.events.subscribe('MARKER.CLICK', this._handleMarkerClick);
			}
		);
	}

	private cameraAnimating: Promise<void>;
	ionViewCanLeave() {
		if (!this.cameraAnimating) {
			return true;
		} else {
			return this.cameraAnimating;
		}
	}

	private _handleMarkerClick(evtData) {
		console.log(JSON.stringify(evtData));
	}

	displayToast() {
		console.log('displayToast()');
		let toast = this.toastCtrl.create({
			message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			showCloseButton: true,
			position: 'top'
		});

		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});

		toast.present();
	}


	openSecondPage() {
		console.log('HomePage: openSecondPage()');
		console.log(`isTransitioning - include ancestor: ${this.navCtrl.isTransitioning(true)}`);
		console.log(`isTransitioning - no ancestor: ${this.navCtrl.isTransitioning(false)}`);

		if (this.navCtrl.isTransitioning())
			return;

		this.navCtrl.push("SecondPage", {}, { animate: false });
	}

	hideMap() {
		console.log('HomePage: hideMap()');
		this.hMap.hide();
	}

	showMap() {
		console.log('HomePage: showMap()');
		this.hMap.show();
	}

	async addMarker(lat?, lng?) {
		console.log('HomePage: addNewMarker()');
		if (!lat) lat = CAMERA_DEFAULT_LAT + Math.random() / 100;
		if (!lng) lng = CAMERA_DEFAULT_LONG + Math.random() / 100;

		const url = "./assets/imgs/finish.png";
		const markerPos = new LatLng(lat, lng);
		const options: MarkerOptions = {
			icon: {
				url: url,
				size: { width: 32, height: 32 },
				anchor: [0, 32],
			},
			infoWindowAnchor: [32, 0],
			position: markerPos,
			zIndex: 999,
			myTitle: 'Marker',
		}
		const marker = this.hMap.nativeMapObj.addMarkerSync(options);
		marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((parmas: any[]) => {
			this.onMarkerClick(parmas.pop() as Marker);
		});

		const currLoc = await this.hMap.nativeMapObj.getMyLocation();
		const routePoints: ILatLng[] = [];
		routePoints.push(currLoc.latLng);
		routePoints.push(markerPos);

		const po: PolylineOptions = {
			points: routePoints,
			width: 8,
			geodesic: true
		}
		this.hMap.nativeMapObj.addPolylineSync(po);
	}


	animateCamera() {
		const lat = CAMERA_DEFAULT_LAT + Math.random();
		const lng = CAMERA_DEFAULT_LONG + Math.random();
		this.addMarker(lat, lng);
		this.cameraAnimating = this.hMap.nativeMapObj.animateCamera({
			target: {
				lat: lat,
				lng: lng
			},
			duration: 5000
		})
			.then(() => {
				this.cameraAnimating = undefined;
			});
	}

	private onMarkerClick(marker: Marker) {
		// Create a component
		const compFactory = this.resolver.resolveComponentFactory(CustomMarkerHtmlWindowComponent);
		let compRef: ComponentRef<CustomMarkerHtmlWindowComponent> = compFactory.create(this.injector);
		compRef.instance.myTitle = marker.get("myTitle");
		this.appRef.attachView(compRef.hostView);

		let div = document.createElement('div');
		div.appendChild(compRef.location.nativeElement);

		// Dynamic rendering
		this._ngZone.run(() => {
			this.htmInfoWindow.setContent(div);
			this.htmInfoWindow.open(marker);
		});

		// Destroy the component when the htmlInfoWindow is closed.
		this.htmInfoWindow.one(GoogleMapsEvent.INFO_CLOSE).then(() => {
			compRef.destroy();
		});
	}
}
