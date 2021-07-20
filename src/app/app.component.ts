import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from "@angular/core";

import {
  Map,
  MapOptions,
  TileLayer,
  PM,
  Rectangle,
  Circle,
  Marker,
  Polygon,
  Polyline
} from "leaflet";
import "@geoman-io/leaflet-geoman-free";

PM.initialize({ optIn: false });

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild("mapElement") el: ElementRef;

  mapInstance: Map;
  tileLayer: TileLayer;

  mapOptions: MapOptions = {
    zoomControl: true,
    zoom: 13,
    center: [51.505, -0.09]
  };
  shapes = [];
  // shapes: <Polygon | Marker | Polygon | Rectangle | Circle | Polyline>[] = [];

  // wait for view to be rendered, this ensures the div we marked as mapElement will not be null/undefined.
  ngAfterViewInit() {
    this.setupLeaflet();
    this.setupGeoman();
    this.setupEventListeners();
  }

  setupLeaflet() {
    // create leaflet map instance
    this.mapInstance = new Map(this.el.nativeElement, this.mapOptions);

    // create + add tile layer to map
    this.tileLayer = new TileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(this.mapInstance);
  }

  setupGeoman() {
    // add leaflet-geoman controls with some options to the map
    this.mapInstance.pm.addControls({
      position: "topleft",
      drawCircle: false,
      removalMode: true
    });
  }

  setupEventListeners() {
    // if a type is missing from the library, you can typecast as any
    // if you find a missing definition, please add and open a PR
    this.mapInstance.on("pm:create", (e) => {
      const shape = e.layer as
        | Polygon
        | Marker
        | Polygon
        | Rectangle
        | Circle
        | Polyline;
      const geoShape = shape.toGeoJSON();
      this.shapes.push(geoShape.geometry);
    });
  }

  ngOnDestroy() {
    // destroy leaflet instance
    this.mapInstance.remove();
  }
}
