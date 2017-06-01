## Google Maps Search Control

Easy to install Google Map expandable search control that allows for [Google Maps Place Autocomplete](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete) searches<br><br>
![Demo](http://i.imgur.com/489S9Cf.gif)<br><br>

### Live demo
[Live demo](https://bhare1985.github.io/google-maps-search-control/)

### How to use

Include the .js and .css files to your html.
In JavaScript, send your map object to the init function:

```markdown
var opts = { center: { lat: -33.8688, lng: 151.2195 }, zoom: 13 };
var map = new google.maps.Map(document.getElementById('map'), opts);

MapSearch.init(map);
```
