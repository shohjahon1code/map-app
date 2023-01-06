import { Modal } from "./UI/Modal";
import { Map } from "./UI/Map";
import { getAddressFromCoords, getCoordsFromAdress } from "./Utility/Location";

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector("form");
    const locateUseBtn = document.querySelector("#locate-btn");
    this.shareBtn = document.getElementById("share-btn");

    this.shareBtn.addEventListener("click", this.sharePlaceHandler);
    locateUseBtn.addEventListener("click", this.locateuserHandler.bind(this));
    addressForm.addEventListener("submit", this.findAddressHandler.bind(this));
  }

  sharePlaceHandler() {
    const shareLinkInput = document.getElementById("share-link");
    shareLinkInput.select();
    if (!navigator.clipboard) {
      return;
    }
    navigator.clipboard
      .writeText(shareLinkInput.value)
      .then(alert("Copied all data"))
      .catch((err) => console.log(err));
  }

  selectPlace(coordinates, address) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
    this.shareBtn.disabled = false;
    const shareLinkInput = document.getElementById("share-link");
    shareLinkInput.value = `${location.origin}/my-place?address=${encodeURI(
      address
    )}&lat=${coordinates.lat}&lng=${coordinates.lng}`;
  }

  locateuserHandler() {
    if (!navigator.geolocation) {
      alert("Geolocation is not available in your browser");
      return;
    }
    const modal = new Modal("loading-modal-content", "Loading");
    modal.show();

    navigator.geolocation.getCurrentPosition(
      async (successful) => {
        const coordinates = {
          lat: successful.coords.latitude,
          lng: successful.coords.longitude,
        };
        const address = await getAddressFromCoords(coordinates);
        modal.hide();
        this.selectPlace(coordinates, address);
      },
      (error) => {
        modal.hide();
        alert(
          "Could not locate unfortunately, Please enter an address manually"
        );
      }
    );
  }

  async findAddressHandler(evt) {
    evt.preventDefault();
    const address = evt.target.querySelector("input").value;
    if (!address || address.trim().length === 0) {
      alert("Invalid address entered - please try again!");
      return;
    }

    const modal = new Modal("loading-modal-content", "Loading");
    modal.show();
    try {
      const coordinates = await getCoordsFromAdress(address);
      this.selectPlace(coordinates, address);
      console.log(coordinates);
    } catch (error) {
      console.log(error.message);
    }
    modal.hide();
  }
}

const placeFinder = new PlaceFinder();
