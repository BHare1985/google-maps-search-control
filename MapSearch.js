"use strict";

var MapSearch = (function() {
	return {
		map: null,
		autocomplete: null,
		bar: null,
		input: null,
		icon: null,
		boundsSelector: null,
		infoWindow: null,
		marker: null,
		createBar: function(expandedByDefault) {
			var rv = document.createElement("div");
			rv.classList.add("mapsearch-bar");
			rv.classList.add("mapsearch-gmap-control");
			
			if(expandedByDefault){
				rv.classList.add("mapsearch-expanded");
			}

			this.input = document.createElement("input");
			this.input.spellcheck = false;
			this.input.title = "Type search here";
			this.input.type = "search";
			this.input.placeholder = "Search...";
			this.input.classList.add("mapsearch-input");
			rv.appendChild(this.input);

			this.icon = document.createElement("a");
			this.icon.title = "Expand search"
			this.icon.classList.add("mapsearch-search-icon");
			rv.appendChild(this.icon);

			rv.appendChild(this.createMenu());

			return rv;
		},
		createMenu: function() {
			var menu = document.createElement("div");
			menu.classList.add("mapsearch-menu");

			var label = document.createElement("a");
			label.setAttribute("title", "Open menu");
			label.setAttribute("href", "#");
			label.classList.add("button");
			menu.appendChild(label);

			this.boundsSelector = document.createElement("input");
			this.boundsSelector.type = "checkbox";
			this.boundsSelector.id = "boundsSelector_" + Math.random().toString(36).substr(2, 10);
			this.boundsSelector.checked = false;


			var cblabel = document.createElement("label");
			cblabel.setAttribute("for", this.boundsSelector.id);
			cblabel.setAttribute("title", "Restrict search to current view of map");
			cblabel.innerText = "Search view only";
			var lists = [
				[this.boundsSelector, cblabel]
			];
			menu.appendChild(this.makeUL(lists));
			return menu;
		},
		makeUL: function(array) {
			// Create the list element:
			var list = document.createElement('ul');

			for (var i = 0; i < array.length; i++) {
				var item = document.createElement('li');

				var x = (array[i] instanceof Array) ? array[i] : [array[i]];
				x.forEach(function(a) {
					var node = (a instanceof Node) ? a : document.createTextNode(a);
					item.appendChild(node);
				});

				list.appendChild(item);
			}
			return list;
		},
		createAutocomplete: function() {
			var rv = new google.maps.places.Autocomplete(this.input);

			// Bind the map's bounds (viewport) property to the autocomplete object,
			// so that the autocomplete requests use the current map bounds for the
			// bounds option in the request.
			rv.bindTo("bounds", this.map);
			rv.setTypes([]);

			return rv;
		},
		createInfoWindow: function() {
			var rv = new google.maps.InfoWindow();

			var content = document.createElement("div");
			content.classList.add("mapsearch-infowindow-content");

			var icon = document.createElement("img");
			icon.id = "place-icon";
			icon.src = "";
			icon.classList.add("placeIcon");

			content.appendChild(icon);

			var name = document.createElement("span");
			name.id = "place-name";
			name.classList.add("placeName");

			content.appendChild(name);
			content.appendChild(document.createElement("br"));

			var address = document.createElement("span");
			address.id = "place-address";
			address.classList.add("placeAddress");

			content.appendChild(address);

			rv.content = content;
			rv.setContent(rv.content);

			return rv;
		},
		createMarker: function() {
			return new google.maps.Marker({
				map: this.map,
				anchorPoint: new google.maps.Point(0, -29),
				title: "Click to remove"
			});
		},
		placeMarker: function(place) {
			this.marker.setVisible(false);

			if (place.geometry.viewport) {
				this.map.fitBounds(place.geometry.viewport);
			} else {
				this.map.setCenter(place.geometry.location);
				this.map.setZoom(17); // Why 17? Because it looks good.
			}

			this.marker.setPosition(place.geometry.location);
			this.marker.setVisible(true);
		},
		updateWindowContent: function(place) {
			this.infoWindow.close();

			var address = "";
			if (place.address_components) {
				address = [
					(place.address_components[0] && place.address_components[0].short_name || ""),
					(place.address_components[1] && place.address_components[1].short_name || ""),
					(place.address_components[2] && place.address_components[2].short_name || "")
				].join(" ");
			}

			this.infoWindow.content.children["place-icon"].src = place.icon;
			this.infoWindow.content.children["place-name"].textContent = place.name;
			this.infoWindow.content.children["place-address"].textContent = address;
			this.infoWindow.open(this.map, this.marker);
		},
		createEvents: function() {
			var self = this;
			
			this.icon.addEventListener('click', function(e) {
				e.preventDefault();
				self.bar.classList.toggle('mapsearch-expanded');
				self.input.value = "";
				if(this.title == "Expand search") {
					this.title = "Collapse search";
				} else {
					this.title = "Expand search";
				}
				
			});


			this.autocomplete.addListener("place_changed", function() {

				var place = self.autocomplete.getPlace();
				if (!place.geometry) {
					window.alert("No details available for input: '" + place.name + "'");
					return;
				}

				self.placeMarker(place);
				self.updateWindowContent(place);
			});


			this.marker.listener = this.marker.addListener("click", function () {
				self.marker.setVisible(false);
			});

			this.boundsSelector.addEventListener("click", function() {
				self.autocomplete.setOptions({
					strictBounds: this.checked
				});
			});
		},
		init: function(map) {
			this.map = map;

			this.bar = this.createBar(false);
			this.infoWindow = this.createInfoWindow();
			this.marker = this.createMarker();
			this.autocomplete = this.createAutocomplete();

			this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.bar);
			
			this.createEvents();
		}
	};
}());