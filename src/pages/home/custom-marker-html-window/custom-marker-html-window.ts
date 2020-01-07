import { Component } from '@angular/core';

@Component({
  selector: 'custom-marker-html-window',
  templateUrl: 'custom-marker-html-window.html'
})
export class CustomMarkerHtmlWindowComponent {

  constructor() {
  }

  myTitle: string;

  onButton_click(event) {
    alert(`This is '${this.myTitle}'`);
  }

}
