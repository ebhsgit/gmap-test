import { Component } from '@angular/core';
import { GoogleMap, GoogleMapOptions, GoogleMapsEvent, HtmlInfoWindow, ILatLng, Marker, MarkerOptions, Polyline, PolylineOptions } from '@ionic-native/google-maps';
import { IonicPage } from 'ionic-angular';
import { MapControllerProvider, MapInstance } from "../../providers/map-controller";

const CAMERA_DEFAULT_LAT = 65.9667;
const CAMERA_DEFAULT_LONG = -18.5333;
const CAMERA_DEFAULT_ZOOMLEVEL = 13;
const POLYLINE_COLOR_BLUE = '#488aff70';
const POLYLINE_COLOR_GREEN = '#32db6470';
const POLYLINE_COLOR_RED = '#f53d3d70';
const POLYLINE_COLOR_YELLOW = '#ffce0070';
const POLYLINE_STROKE_WIDTH = 5;

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	private hMap: MapInstance;
	private get gMap(): GoogleMap {
		return this.hMap.nativeMapObj
	}

	htmInfoWindow: HtmlInfoWindow;

	constructor(
		private mapCtrl: MapControllerProvider,
	) {
	}

	ionViewWillLeave() {
		console.log('HomePage: ionViewWillLeave()');
		this.hMap.hide();
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
					lat: 2,
					lng: 2
				},
				zoom: 10,
			},
			preferences: {
				building: false
			}
		};

		this.hMap = this.mapCtrl.addMap('HOME', 'map_canvas', newMapOptions);
		this.htmInfoWindow = new HtmlInfoWindow();
	}

	ionViewDidEnter() {
		console.log('HomePage: ionViewDidEnter()');
		this.hMap.show();
	}

	private cameraAnimating: Promise<void>;
	ionViewCanLeave() {
		if (!this.cameraAnimating) {
			return true;
		} else {
			return this.cameraAnimating;
		}
	}

	hideMap() {
		console.log('HomePage: hideMap()');
		this.hMap.hide();
	}

	showMap() {
		console.log('HomePage: showMap()');
		this.hMap.show();
	}

	private bluePolyline: Polyline
	private greenPolyline: Polyline
	private redPolyline: Polyline
	private yellowPolyline: Polyline

	createPolylines() {
		this.bluePolyline = this._createPolyline("blue", POLYLINE_COLOR_BLUE, 0)
		this.greenPolyline = this._createPolyline("green", POLYLINE_COLOR_GREEN, .1)
		this.redPolyline = this._createPolyline("red", POLYLINE_COLOR_RED, .2)
		this.yellowPolyline = this._createPolyline("yellow", POLYLINE_COLOR_YELLOW, .3)
	}

	private _createPolyline(name: string, color: string, lat: number): Polyline {
		const options: PolylineOptions = {
			points: [
				{ lat: lat, lng: 0 },
				{ lat: lat + 1, lng: 1 },
				{ lat: lat + 2, lng: 2 },
				{ lat: lat + 3, lng: 3 },
				{ lat: lat + 4, lng: 4 },
			],
			color: color,
			width: POLYLINE_STROKE_WIDTH,
			clickable: true,
			geodesic: true,
		};
		const polyline = this.gMap.addPolylineSync(options);
		polyline.set("name", name)
		polyline.on(GoogleMapsEvent.POLYLINE_CLICK).subscribe((params: any) => {
			this.onPolylineClicked(params[0], params[1]);
		});

		return polyline
	}


	private onPolylineClicked(position: ILatLng, polyline: Polyline) {
		const options: MarkerOptions = {
			position: position,
			zIndex: 999,
			title: polyline.get("name") || "Marker",
		}
		const marker = this.gMap.addMarkerSync(options)
		marker.on(GoogleMapsEvent.INFO_CLOSE).subscribe((params: any) => {
			const m = params[1] as Marker;
			if (m) {
				m.remove();
				m.destroy();
			}
		});

		marker.showInfoWindow();
	}

	changePoints_green() {
		const newPoints = this.greenPolyline.getPoints().map((_, i) => {
			return {
				lat: i,
				lng: 2,
			} as ILatLng
		})

		this.greenPolyline.setPoints(newPoints)
	}
}
