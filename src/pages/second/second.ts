import { Component } from '@angular/core';
import { GoogleMap, GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, LatLng, MarkerOptions, PolylineOptions } from '@ionic-native/google-maps';
import { NavController } from 'ionic-angular';

const CAMERA_DEFAULT_LAT = 40.771133;
const CAMERA_DEFAULT_LONG = -73.974187;
const CAMERA_DEFAULT_ZOOMLEVEL = 13;


@Component({
	selector: 'page-second',
	templateUrl: 'second.html'
})
export class SecondPage {

	mapReady: boolean = false;
	map: GoogleMap;


	constructor(public navCtrl: NavController) {
	}

	ionViewDidEnter() {
		console.log('SecondPage: ionViewDidEnter()');
		this.loadMap();
	}

	loadMap() {
		console.log('SecondPage: loadMap()');
		this.map = GoogleMaps.create('map_second', {
			mapType: 'MAP_TYPE_NORMAL',
			controls: {
				compass: true,
				myLocationButton: true,
				indoorPicker: false,
				zoom: true
			},
			gestures: {
				scroll: true,
				tilt: false,
				rotate: true,
				zoom: true
			},
			styles: [
				{
					featureType: "all",
					stylers: [
						{ saturation: -80 }
					]
				},
				{
					featureType: "poi.business",
					elementType: "labels",
					stylers: [
						{ visibility: "off" }
					]
				}
			],
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
		});

		this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
			this.mapReady = true;
			console.log('SecondPage: map is ready...');
		});

	}

	ionViewWillLeave() {
		this.map.setDiv();
	}

	ionViewWillUnload() {

	}

	goBackFirst() {
		this.navCtrl.pop();
	}

	addPolyline() {
		const options: PolylineOptions = {
			points: [
				{ lat: CAMERA_DEFAULT_LAT, lng: CAMERA_DEFAULT_LONG },
				{ lat: CAMERA_DEFAULT_LAT + Math.random() / 100, lng: CAMERA_DEFAULT_LONG + Math.random() / 100 },
				{ lat: CAMERA_DEFAULT_LAT + Math.random() / 100, lng: CAMERA_DEFAULT_LONG + Math.random() / 100 },
				{ lat: CAMERA_DEFAULT_LAT + Math.random() / 100, lng: CAMERA_DEFAULT_LONG + Math.random() / 100 },
				{ lat: CAMERA_DEFAULT_LAT + Math.random() / 100, lng: CAMERA_DEFAULT_LONG + Math.random() / 100 },
				{ lat: CAMERA_DEFAULT_LAT + Math.random() / 100, lng: CAMERA_DEFAULT_LONG + Math.random() / 100 },
				{ lat: CAMERA_DEFAULT_LAT + Math.random() / 100, lng: CAMERA_DEFAULT_LONG + Math.random() / 100 },
			]
		};
		this.map.addPolylineSync(options);
	}

	addMarker(lat?, lng?) {
		if(!lat) lat = CAMERA_DEFAULT_LAT + Math.random() / 100;
		if(!lng) lng = CAMERA_DEFAULT_LONG + Math.random() / 100;
		const options: MarkerOptions = {
			title: 'Marker',
			snippet: "hello",
			icon: 'blue',
			position: new LatLng(lat, lng),
			zIndex: 999,
			animation: GoogleMapsAnimation.DROP
		}
		this.map.addMarkerSync(options);
	}

	animateCamera() {
		const lat = CAMERA_DEFAULT_LAT + Math.random();
		const lng = CAMERA_DEFAULT_LONG + Math.random();
		this.addMarker(lat, lng);
		this.map.animateCamera({
			target: {
				lat: lat,
				lng: lng
			},
			duration: 5000
		});
	}
}