export class Map {
  constructor(coords) {
    this.render(coords);
  }

  render(coordinates) {
    if (!google) {
      alert("Could not load maps - please try later!");
      return;
    }

    const map = new google.maps.Map(document.getElementById("map"), {
      center: coordinates,
      zoom: 16,
    });
    new google.maps.Marker({
      position: coordinates,
      map: map,
    });
  }
}
