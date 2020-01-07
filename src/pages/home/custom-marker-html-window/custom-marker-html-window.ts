import { Component } from '@angular/core';

@Component({
	selector: 'custom-marker-html-window',
	templateUrl: 'custom-marker-html-window.html'
})
export class CustomMarkerHtmlWindowComponent {
	myTitle: string;
	cId: string;

	constructor() {
	}

	onButton_click(event) {
		alert(`This is '${this.cId}'`);
	}

}
