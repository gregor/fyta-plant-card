
const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const SCHEMA = [
  { name: "title", selector: { text: {} } },
  { name: "device_id", required: true, selector: { device: { integration: 'fyta' } } }
];

class FytaPlantCard extends HTMLElement {

  static getConfigElement() {
    return document.createElement("fyta-plant-card-editor");
  }

  static getStubConfig() {
    return { device_id: "", title: ""};
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._initialized = false;
    this._plant_image = "";
    this._sensor_entities = {battery_entity: "", light_entity: "", moisture_entity: "", salinity_entity: "", temperature_entity: ""};
    this._status_entities = { plant_status: "", light_status: "", moisture_status: "", salinity_status: "", temperature_status: "" };
    this._plantStatusColor = { deleted: "white", doing_great: "green", need_attention: "yellow", no_sensor: "white" };
    this._measurementStatusColor = {no_data: "white", too_low: "red", low: "yellow", perfect: "green", high: "yellow", too_high: "red"};

    this._icons = [
      "mdi:battery",
      "mdi:white-balance-sunny",
      "mdi:water",
      "mdi:thermometer",
      "mdi:emoticon-poop"
    ];
  }

  _click(entity) {
    this._fire("hass-more-info", { entityId: entity });
  }

  _computeBatteryIcon(state) {
    const icon = 'hass:battery';
    if (state <= 5) {
      return `${icon}-alert`;
    } else if (state < 95) {
      return `${icon}-${Math.round((state / 10) - 0.01) * 10}`;
    }
    return icon;
  }

  _fire(type, detail) {
    const event = new Event(type, {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    event.detail = detail || {};
    this.shadowRoot.dispatchEvent(event);
    return event;
  }

  _getStateColor(key, hass) {
    console.debug(`getStateColor - ${key}`);
    console.debug(`State - ${hass.states[this._status_entities.plant_status].state}, color: ${this._plantStatusColor[hass.states[this._status_entities.plant_status].state]}`);
    if (key === 'battery_entity') {
      const state = hass.states[this._status_entities.temperature_status].state;
      if (state <= 5) {
        return "red";
      } else if (state <= 15) {
        return "yellow";
      } else {
        return "white";
      }
    } else if (key === 'light_entity') {
      return this._measurementStatusColor[hass.states[this._status_entities.light_status].state];
    } else if (key === 'moisture_entity') {
      return this._measurementStatusColor[hass.states[this._status_entities.moisture_status].state];
    } else if (key === 'salinity_entity') {
      return this._measurementStatusColor[hass.states[this._status_entities.salinity_status].state];
    } else if (key === 'temperature_entity') {
      return this._measurementStatusColor[hass.states[this._status_entities.temperature_status].state];
    } else if (key === 'plant') {
      return this._plantStatusColor[hass.states[this._status_entities.plant_status].state];
    }
  }

  getCardSize() {
    return 3;
  }

  getLayoutOptions() {
    return {
      grid_rows: 2,
      grid_columns: 3,
      grid_min_rows: 2,
      grid_min_columns: 2,
    };
  }

  set hass(hass) {
    if (!this.config) {
      return html``;
    }
    if (!this.config.device_id) {
      return html`<hui-warning>No device specified</hui-warning>`;
    }
    if (!this._initialized) {
      this.updateEntities(this.config.device_id, hass)
    }

    const config = this.config;

    let _title = config.title;

    this.shadowRoot.getElementById("box").innerHTML = `
      <div class="title" style="color:${this._getStateColor("plant", hass)};">${_title}</div>
      <div id="sensors">
      </div>
    `;

    const sensorKeys = ['battery_entity', 'light_entity', 'moisture_entity', 'temperature_entity', 'salinity_entity'];
    sensorKeys.forEach(key => {
      if (this._sensor_entities[key] != "") {
        let _sensor = this._sensor_entities[key];
        let _state = hass.states[String(_sensor)].state;
        let _uom = hass.states[String(_sensor)].attributes.unit_of_measurement;
        let _class = "state-on";
        //if (hass.states[this._sensor_entities[key]].attributes.problem.indexOf(_sensors[parseInt(i)]) !== -1) {
        //  _class += " state-problem";
        //}


        let _icon = "";
        if (key === 'battery_entity') {
          _icon = this._computeBatteryIcon(_state);
        } else {
          _icon = this._icons[sensorKeys.indexOf(key)]
        }

        this.shadowRoot.getElementById("sensors").innerHTML += `
          <div id="sensor_${key}" class="sensor">
            <div class="icon" style="color:${this._getStateColor(key, hass)};"><ha-icon icon="${_icon}"></ha-icon></div>
            <div class="${_class}">${_state}</div>
            <div class="uom">${_uom}</div>
          </div>
        `;
      }
    });

    sensorKeys.forEach(key => {
      if (this._sensor_entities[key] != "") {
        this.shadowRoot.getElementById(`sensor_${key}`).onclick = this._click.bind(this, this._sensor_entities[key]);
      }
    });
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }

    const oldDevice = this?.config?.device_id;
    this.config = config;

    if (!config.device_id) {
      throw new Error("You need to define a device");
    }

    if (this.config.device_id != oldDevice) {
      this._initialized = false;
    }
  }

  updateEntities(device_id, hass) {
    if (!hass) {
      console.debug(`hass not set.`);
      return;
    }
    if (!device_id) {
      console.debug(`device_id not set.`);
      return;
    }

    const device = hass.devices[device_id];
    let device_name = device.name;

    if (!this.config?.title || this.config.title === "") {
      this.config = { ...this.config, title: device_name };
    }

    device_name = device_name.toLowerCase();

    const device_entities = Object.keys(hass.entities).filter(id => hass.entities[id].device_id === device_id)

    device_entities.forEach(id => this.getEntityId(id, hass), this);

    const root = this.shadowRoot;
    if (root.lastChild) {
      root.removeChild(root.lastChild);
    }

    const card = document.createElement("ha-card");
    const content = document.createElement("div");
    const style = document.createElement("style");

    style.textContent = css`
      ha-card {
        position: relative;
        padding: 0;
        background-size: 100%;
      }

      img {
        display: block;
        height: auto;
        transition: filter .2s linear;
        width: 100%;
      }

      .box {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 16%;
        min-height: 64px;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 4px 8px;
        color: white;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
        text-align: center;
      }

      div.title {
        flex: 0 1 20%;
      }

      div#sensors {
        display: flex;
        justify-content: space-between;
        flex: 1;
      }

      .sensor {
        flex-grow: 1;
      }

      ha-icon {
        cursor: pointer;
        color: var(--primary-color);
      }

      .state-problem {
        color: var(--accent-color);
      }
    `;

    content.id = "container";
    content.innerHTML = `
      <div id="wrapper">
        <img src="${this._plant_image}" />
      </div>
      <div class="box" id="box"></div>
    `;
    card.appendChild(content);
    card.appendChild(style);
    root.appendChild(card);

    this._initialized = true;
  }

  getEntityId(id, hass) {
    if (hass.states[id].attributes.device_class == 'battery' && id.startsWith('sensor.')) {
      const entityId = hass.states[id].entity_id;
      this._sensor_entities.battery_entity = entityId;
    } else if (hass.states[id].attributes.device_class == 'moisture') {
      const entityId = hass.states[id].entity_id;
      this._sensor_entities.moisture_entity = entityId;
    } else if (hass.states[id].attributes.device_class == 'conductivity') {
      const entityId = hass.states[id].entity_id;
      this._sensor_entities.salinity_entity = entityId;
    } else if (hass.states[id].attributes.device_class == 'temperature') {
      const entityId = hass.states[id].entity_id;
      this._sensor_entities.temperature_entity = entityId;
    } else if (hass.states[id].attributes.unit_of_measurement == 'μmol/s⋅m²') {
      const entityId = hass.states[id].entity_id;
      this._sensor_entities.light_entity = entityId;
    } else if (id.startsWith('image.')) {
      this._plant_image =  hass.states[id].attributes.entity_picture;
    } else if (hass.states[id].attributes.device_class == 'enum') {
      if (hass.entities[id].translation_key === 'plant_status') {
        this._status_entities.plant_status = hass.states[id].entity_id;
      } else if (hass.entities[id].translation_key === 'light_status') {
        this._status_entities.light_status = hass.states[id].entity_id;
      } else if (hass.entities[id].translation_key === 'moisture_status') {
        this._status_entities.moisture_status = hass.states[id].entity_id;
      } else if (hass.entities[id].translation_key === 'salinity_status') {
        this._status_entities.salinity_status = hass.states[id].entity_id;
      } else if (hass.entities[id].translation_key === 'temperature_status') {
        this._status_entities.temperature_status = hass.states[id].entity_id;
      }
    }
  }
}

customElements.define("fyta-plant-card", FytaPlantCard);


function deepClone(value) {
  if (!(!!value && typeof value === "object")) {
    return value;
  }
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return new Date(value.getTime());
  }
  if (Array.isArray(value)) {
    return value.map(deepClone);
  }
  var result = {};
  Object.keys(value).forEach(
    function(key) { result[String(key)] = deepClone(value[String(key)]); });
  return result;
}

export class FytaPlantCardEditor extends LitElement {

  static properties = {
    hass: { type: Object },
    config: { state: true }
  };

  get _device_id() {
    return this.config?.device_id || '';
  }

  _computeLabel(schema) {
    if (schema.name == 'device_id') return 'Device (Required)';
    if (schema.name == 'title') return 'Title (Optional)';
    return '';
  }

  get _title() {
    return this.config?.title || '';
  }

  _valueChanged(ev) {
    if (!this.config || !this.hass) {
      return;
    }

    if (this.config.device_id === ev.detail.value.device_id && this.config.title === ev.detail.value.title) {
      return;
    }

    this.config.device_id = ev.detail.value.device_id;

    if (ev.detail.value.title === "" && this.config.device_id != "") {
      const device = this.hass.devices[this.config.device_id];

      this.config.title = device.name;
    } else {
      this.config.title = ev.detail.value.title;
    }

    this.configChanged(this.config);
  }

  configChanged(newConfig) {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass) {
      return html``;
    }
    if (!this.config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="side-by-side">
          <ha-form
            .hass=${this.hass}
            .data=${this.config}
            .schema=${SCHEMA}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
      </div>
    `;
  }

  setConfig(config) {

    if (config.title === "" && config.device_id != "" && this.hass) {
      const device = this.hass.devices[config.device_id];

      config.title = device.name;
    }

    this.config = deepClone(config);
  }

}

customElements.define("fyta-plant-card-editor", FytaPlantCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "fyta-plant-card",
  name: "Fyta Plant Card",
  preview: true,
  description: "Custom card for your FYTA plant data"
});