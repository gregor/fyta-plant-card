const LitElement = Object.getPrototypeOf(
  customElements.get('ha-panel-lovelace')
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const DEFAULT_CONFIG = {
  device_id: '',
  title: '',
  display_mode: 'full',
  state_color: true,
  battery_threshold: 30,
  show_light: true,
  light_order: '2',
  show_moisture: true,
  moisture_order: '1',
  show_temperature: true,
  temperature_order: '3',
  show_salinity: false,
  salinity_order: '5',
  show_nutrition: true,
  nutrition_order: '4',
  show_scientific_name: true,
  state_color_plant: true,
  state_color_sensor: true,
  state_color_icon: true,
};

const DEVICE_CLASS = {
  Battery: 'battery',
  Conductivity: 'conductivity',
  Date: 'date',
  Enum: 'enum',
  Light: 'light',
  Moisture: 'moisture',
  Temperature: 'temperature',
};

const MEASUREMENT_STATUS_STATES = {
  NoData: 'no_data',
  TooLow: 'too_low',
  Low: 'low',
  Perfect: 'perfect',
  High: 'high',
  TooHigh: 'too_high',
};

const MEASUREMENT_STATUS_COLORS = {
  [MEASUREMENT_STATUS_STATES.NoData]: 'var(--disabled-text-color, #808080)',
  [MEASUREMENT_STATUS_STATES.TooLow]: 'var(--error-color, #F44336)',
  [MEASUREMENT_STATUS_STATES.Low]: 'var(--warning-color, #FFC107)',
  [MEASUREMENT_STATUS_STATES.Perfect]: 'var(--success-color, #4CAF50)',
  [MEASUREMENT_STATUS_STATES.High]: 'var(--warning-color, #FFC107)',
  [MEASUREMENT_STATUS_STATES.TooHigh]: 'var(--error-color, #F44336)',
};

const ORDER_OPTIONS = [
  { label: 'Order 1 (First)', value: '1' },
  { label: 'Order 2', value: '2' },
  { label: 'Order 3', value: '3' },
  { label: 'Order 4', value: '4' },
  { label: 'Order 5 (Last)', value: '5' },
];

const PLANT_STATUS_STATES = {
  Deleted: 'deleted',
  DoingGreat: 'doing_great',
  NeedAttention: 'need_attention',
  NoSensor: 'no_sensor',
};

const PLANT_STATUS_COLORS = {
  [PLANT_STATUS_STATES.Deleted]: 'var(--text-color, #FFFFFF)',
  [PLANT_STATUS_STATES.DoingGreat]: 'var(--success-color, #4CAF50)',
  [PLANT_STATUS_STATES.NeedAttention]: 'var(--warning-color, #FFC107)',
  [PLANT_STATUS_STATES.NoSensor]: 'var(--disabled-text-color, #808080)',
};

const SCHEMA = [
  {
    name: 'header_device',
    type: 'constant',
    label: 'Plant',
  },
  {
    name: 'device_id',
    label: 'Device (Required)',
    required: true,
    selector: {
      device: {
        integration: 'fyta',
      },
    },
  },
  { name: 'title',
    label: 'Title',
    selector: {
      text: {},
    },
  },
  {
    name: 'header_measurements',
    type: 'constant',
    label: 'Sensor Measurements',
  },
  {
    name: 'battery_threshold',
    label: 'Battery Threshold (%)',
    selector: {
      number: {
        min: 0,
        max: 100,
        step: 5,
        mode: 'slider'
      }
    },
    default: 10
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'show_moisture',
        label: 'Soil Moisture',
        selector: { boolean: {} },
      },
      {
        name: 'moisture_order',
        label: 'Moisture Order',
        selector: {
          select: {
            options: ORDER_OPTIONS,
            mode: 'dropdown',
          }
        },
        default: '1',
      }
    ]
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'show_light',
        label: 'Light',
        selector: { boolean: {} },
      },
      {
        name: 'light_order',
        label: 'Light Order',
        selector: {
          select: {
            options: ORDER_OPTIONS,
            mode: 'dropdown',
          }
        },
        default: '2',
      }
    ]
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'show_temperature',
        label: 'Ambient Temperature',
        selector: { boolean: {} },
      },
      {
        name: 'temperature_order',
        label: 'Temperature Order',
        selector: {
          select: {
            options: ORDER_OPTIONS,
            mode: 'dropdown',
          }
        },
        default: '3',
      }
    ]
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'show_nutrition',
        label: 'Nutrition',
        selector: { boolean: {} },
      },
      {
        name: 'nutrition_order',
        label: 'Nutrition Order',
        selector: {
          select: {
            options: ORDER_OPTIONS,
            mode: 'dropdown',
          }
        },
        default: '4',
      }
    ]
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'show_salinity',
        label: 'Salinity',
        selector: { boolean: {} },
      },
      {
        name: 'salinity_order',
        label: 'Salinity Order',
        selector: {
          select: {
            options: ORDER_OPTIONS,
            mode: 'dropdown',
          }
        },
        default: '5',
      }
    ]
  },
  {
    name: 'nutrition_info',
    type: 'constant',
    label: 'Nutrition and Salinity',
    value: 'The Nutrition Score combines multiple measurements (salinity, conductivity, growth data, and fertilization timing) into a single metric. Showing salinity separately is generally not needed as it is already included in this score.'
  },
  {
    name: 'header_layout',
    type: 'constant',
    label: 'Layout',
  },
  {
    name: 'display_mode',
    label: 'Display Mode',
    selector: {
      select: {
        options: [
          { label: 'Full', value: 'full' },
          { label: 'Compact', value: 'compact' },
        ],
        mode: 'box',
      },
    },
    default: 'full',
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'show_scientific_name',
        label: 'Show Scientific Name',
        type: 'boolean',
        selector: { boolean: {} },
      },
      {
        name: 'state_color_plant',
        label: 'Show plant state color',
        selector: { boolean: {} },
      },
    ],
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'state_color_sensor',
        label: 'Show sensor state color',
        selector: { boolean: {} },
      },
      {
        name: 'state_color_icon',
        label: 'Show state color icons',
        selector: { boolean: {} },
      },
    ],
  },
];

const SENSOR_TYPES = {
  Battery: 'battery',
  FertilizedLast: 'fertilizedLast',
  FertilizedNext: 'fertilizedNext',
  Light: 'light',
  LightState: 'light',
  Moisture: 'moisture',
  MoistureState: 'moisture',
  Nutrients: 'nutrients',
  NutrientsState: 'nutrients',
  PlantState: 'plant',
  Salinity: 'salinity',
  SalinityState: 'salinity',
  ScientificName: 'scientificName',
  Temperature: 'temperature',
  TemperatureState: 'temperature',
};

const SENSOR_SETTINGS = {
  [SENSOR_TYPES.Battery]: {
    min: 0,
    max: 100,
    icon: 'mdi:battery',
    name: 'Battery',
  },
  [SENSOR_TYPES.Light]: {
    icon: 'mdi:white-balance-sunny',
    name: 'Light',
  },
  [SENSOR_TYPES.Moisture]: {
    min: 0,
    max: 100,
    icon: 'mdi:water',
    name: 'Soil Moisture',
  },
  [SENSOR_TYPES.Nutrients]: {
    icon: 'mdi:bucket',
    name: 'Nutrition',
  },
  [SENSOR_TYPES.Temperature]: {
    min: 0,
    max: 50,
    icon: 'mdi:thermometer',
    name: 'Ambient Temperature',
  },
  [SENSOR_TYPES.Salinity]: {
    icon: 'mdi:water-percent',
    name: 'Salinity',
  },
};

const SUPPORTED_SENSORS = [
  SENSOR_TYPES.Light,
  SENSOR_TYPES.Moisture,
  SENSOR_TYPES.Temperature,
  SENSOR_TYPES.Salinity,
];

const parseConfig = (config) => {
  // Create a completely new config object with all defaults set
  const newConfig = { ...DEFAULT_CONFIG };

  // Then copy values from provided config
  if (config) {
    Object.keys(config).forEach(key => {
      if (config[key] !== undefined &&
        key !== 'display_options' &&
        key !== 'show_ec' &&
        key !== 'sensor_order' &&
        !key.includes('_priority') &&
        !key.includes('_position')) {
        newConfig[key] = config[key];
      }
    });
  }

  // Handle legacy config with priority or position values
  const sensorTypes = [SENSOR_TYPES.Light, SENSOR_TYPES.Moisture, SENSOR_TYPES.Temperature, SENSOR_TYPES.Salinity, SENSOR_TYPES.Nutrients];
  sensorTypes.forEach(type => {
    const priorityKey = `${type}_priority`;
    const positionKey = `${type}_position`;
    const orderKey = `${type}_order`;
    if (config[priorityKey] !== undefined) {
      newConfig[orderKey] = String(config[priorityKey]);
    } else if (config[positionKey] !== undefined) {
      newConfig[orderKey] = String(config[positionKey]);
    }
  });

  // Ensure at least one option is selected
  const hasSelection =
    newConfig.show_light ||
    newConfig.show_moisture ||
    newConfig.show_temperature ||
    newConfig.show_salinity ||
    newConfig.show_nutrition;

  // Default to showing all but salinity if nothing selected
  if (!hasSelection) {
    newConfig.show_light = true;
    newConfig.show_moisture = true;
    newConfig.show_temperature = true;
    newConfig.show_salinity = false;
    newConfig.show_nutrition = true;
  }

  return newConfig;
};


class FytaPlantCard extends HTMLElement {

  static getConfigElement() {
    return document.createElement('fyta-plant-card-editor');
  }

  static getStubConfig() {
    return DEFAULT_CONFIG;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._initialized = false;
    this._plantImage = '';
    this._measurementEntityIds = {
      [SENSOR_TYPES.Battery]: '',
      [SENSOR_TYPES.Light]: '',
      [SENSOR_TYPES.Moisture]: '',
      [SENSOR_TYPES.Temperature]: '',
      [SENSOR_TYPES.Salinity]: '',
    };

    this._stateEntityIds = {
      [SENSOR_TYPES.LightState]: '',
      [SENSOR_TYPES.MoistureState]: '',
      [SENSOR_TYPES.NutrientsState]: '',
      [SENSOR_TYPES.PlantState]: '',
      [SENSOR_TYPES.SalinityState]: '',
      [SENSOR_TYPES.TemperatureState]: '',
    };

    this._otherEntityIds = {
      [SENSOR_TYPES.FertilizedLast]: '',
      [SENSOR_TYPES.FertilizedNext]: '',
      [SENSOR_TYPES.ScientificName]: '',
    };

  }

  _click(entityId) {
    if (!entityId) return;
    const event = new Event('hass-more-info', {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    event.detail = { entityId };
    this.dispatchEvent(event);
    return event;
  }

  _getStateColor(stateType, hass) {
    switch (stateType) {
      case SENSOR_TYPES.LightState:
      case SENSOR_TYPES.MoistureState:
      case SENSOR_TYPES.NutrientsState:
      case SENSOR_TYPES.SalinityState:
      case SENSOR_TYPES.TemperatureState: {
        const entityId = this._stateEntityIds[stateType];
        const state = hass.states[entityId]?.state || MEASUREMENT_STATUS_COLORS.NoData;
        return MEASUREMENT_STATUS_COLORS[state];
      }
      case SENSOR_TYPES.PlantState: {
        const entityId = this._stateEntityIds[stateType];
        const state = hass.states[entityId]?.state || PLANT_STATUS_STATES.NoSensor;
        return PLANT_STATUS_COLORS[state];
      }
      default: {
        return 'var(--primary-text-color, #FFFFFF)';
      }
    }
  }

  // Format date for display (remove time component)
  _formatDateForDisplay(dateString) {
    if (!dateString) return '';

    // If date contains a T (ISO format), split and return just the date part
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }

    return dateString;
  }

  // Calculate days from now
  _calculateDaysFromNow(inputDateString) {
    if (!inputDateString) return null;

    // Create Date object for the current date - use local midnight
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Create Date object for the input date
    // Make sure to handle ISO format (YYYY-MM-DDThh:mm:ss)
    const inputDate = new Date(inputDateString);

    // Calculate time difference in milliseconds
    const timeDifference = inputDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
    return Math.ceil(timeDifference / DAY_IN_MILLISECONDS);
  }

  getCardSize() {
    // Return different sizes based on display mode and number of sensors shown
    if (this.config?.display_mode === 'compact') {
      return 3;
    }

    const baseSize = 4; // Base size

    // Count enabled sensors
    let sensorCount = 0;
    if (this.config?.show_light) sensorCount++;
    if (this.config?.show_moisture) sensorCount++;
    if (this.config?.show_temperature) sensorCount++;
    if (this.config?.show_salinity) sensorCount++;
    if (this.config?.show_nutrition) sensorCount++;

    // Add 0.5 for each sensor beyond the first 2
    if (sensorCount > 2) {
      return baseSize + (sensorCount - 2) * 0.5;
    }

    return baseSize;
  }

  getLayoutOptions() {
    return {
      grid_rows: 3,
      grid_columns: 4,
      grid_min_rows: 3,
      grid_min_columns: 2,
    };
  }

  set hass(hass) {
    if (!this.config) {
      return;
    }

    // If no device is specified, show a configuration prompt
    if (!this.config.device_id) {
      if (!this.shadowRoot.lastChild || this.shadowRoot.lastChild.tagName !== 'HA-CARD') {
        const card = document.createElement('ha-card');
        card.header = 'FYTA Plant Card';
        card.innerHTML = `
          <div class="card-content">
            Please select a FYTA device in the card configuration.
          </div>
        `;

        if (this.shadowRoot.lastChild) {
          this.shadowRoot.removeChild(this.shadowRoot.lastChild);
        }

        this.shadowRoot.appendChild(card);
      }
      return;
    }

    if (!this._initialized) {
      this.updateEntities(this.config.device_id, hass)
    } else {
      // On subsequent updates, we only need to update the display values and colors
      this._updateDisplayValues(hass);
    }
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    const newConfig = parseConfig(config);

    const oldDeviceId = this.config?.device_id;
    const newDeviceId = newConfig.device_id;
    if (newDeviceId != oldDeviceId) {
      this._initialized = false;
    }

    this.config = newConfig;
  }

  _handleEntity(id, hass) {
    const stateEntity = hass.states[id];
    if (!stateEntity) return;

    if (id.startsWith('image.')) {
      this._plantImage = hass.states[id].attributes.entity_picture;
      return;
    }

    if (id.endsWith('_scientific_name')) {
      this._otherEntityIds[SENSOR_TYPES.ScientificName] = stateEntity.entity_id;
      return;
    }

    if (id.startsWith('sensor.')) {
      if (!stateEntity.attributes.device_class && stateEntity.attributes.unit_of_measurement == 'μmol/s⋅m²') {
        this._measurementEntityIds[SENSOR_TYPES.Light] = stateEntity.entity_id;
        return;
      }

      switch (stateEntity.attributes.device_class) {
        case DEVICE_CLASS.Battery:
        case DEVICE_CLASS.Moisture:
        case DEVICE_CLASS.Temperature: {
          this._measurementEntityIds[stateEntity.attributes.device_class] = stateEntity.entity_id;
          return;
        }
        case DEVICE_CLASS.Conductivity: {
          this._measurementEntityIds[SENSOR_TYPES.Salinity] = stateEntity.entity_id;
          return;
        }
        case DEVICE_CLASS.Date: {
          // Capture the last fertilization date entity - support both naming patterns
          if (id.includes('fertilize_last') || id.includes('last_fertilized')) {
            this._otherEntityIds[SENSOR_TYPES.FertilizedLast] = stateEntity.entity_id;
            return;
          }
          // Capture the next fertilization date entity - support both naming patterns
          if (id.includes('fertilize_next') || id.includes('next_fertilization')) {
            this._otherEntityIds[SENSOR_TYPES.FertilizedNext] = stateEntity.entity_id;
            return;
          }
          break;
        }
        case DEVICE_CLASS.Enum: {
          const entity = hass.entities[id];
          if (!entity) return;

          switch (entity.translation_key) {
            case 'plant_status':
            case 'light_status':
            case 'moisture_status':
            case 'salinity_status':
            case 'temperature_status':
            case 'nutrients_status': {
              this._stateEntityIds[entity.translation_key.replace('_status', '')] = stateEntity.entity_id;
              return;
            }
          }
        }
      }
    }
  }

  _handleEntities(hass, device_id) {
    Object.keys(hass.entities)
      .filter(id => hass.entities[id].device_id === device_id)
      .forEach(id => this._handleEntity(id, hass), this);
  }

  updateEntities(deviceId, hass) {
    if (!hass) {
      console.debug(`hass not set.`);
      return;
    }
    if (!deviceId) {
      console.debug(`device_id not set.`);
      return;
    }

    const device = hass.devices[deviceId];

    // Create a new config object with all defaults
    if (!this.config?.title || this.config.title === '') {
      const newConfig = {
        ...DEFAULT_CONFIG,
        ...this.config,
        device_id: deviceId || '',
        title: device.name,
      };

      this.config = newConfig;
    }

    this._handleEntities(hass, deviceId);

    const root = this.shadowRoot;
    if (root.lastChild) {
      root.removeChild(root.lastChild);
    }

    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const style = document.createElement('style');

    style.textContent = `
      ha-card {
        position: relative;
        padding: 0;
        background-size: 100%;
        margin-top: 25px;
      }

      img {
        display: block;
        height: auto;
        transition: filter .2s linear;
        width: 100%;
      }

      .header {
        padding-top: 8px;
        height: 72px;
        position: relative;
      }

      .header > img {
        border-radius: 50%;
        width: 88px;
        height: 88px;
        object-fit: cover;
        margin-left: 16px;
        margin-right: 16px;
        margin-top: -28px;
        float: left;
        box-shadow: var( --ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2) );
        cursor: pointer;
      }

      .header > #name {
        font-weight: bold;
        width: calc(100% - 120px);
        margin-top: 8px;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        cursor: pointer;
      }

      .header > #scientific-name {
        color: #8c96a5;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        cursor: pointer;
      }

      #battery {
        position: absolute;
        right: 16px;
        top: 24px;
      }

      .attributes {
        display: flex;
        flex-wrap: wrap;
        white-space: nowrap;
        padding: 4px 16px 8px;
      }

      .attribute {
        white-space: nowrap;
        display: flex;
        align-items: center;
        width: 100%;
        margin-bottom: 8px;
        cursor: pointer;
      }

      .attribute ha-icon {
        margin-right: 8px;
        flex-shrink: 0;
        width: 24px;
        text-align: center;
      }

      .sensor-value {
        flex-shrink: 0;
        margin-right: 4px;
        text-align: right;
        min-width: 40px;
      }

      .meter {
        height: 8px;
        background-color: var(--primary-background-color);
        border-radius: 2px;
        margin-right: 8px;
        display: inline-grid;
        overflow: hidden;
        flex-grow: 1;
        max-width: none;
      }

      .meter > span {
        grid-row: 1;
        grid-column: 1;
        height: 100%;
      }

      .meter > .good {
        background-color: rgba(43,194,83,1);
      }

      .meter > .bad {
        background-color: rgba(240,163,163);
      }

      .meter > .warning {
        background-color: rgba(255,193,7,1);
      }

      .meter > .unavailable {
        background-color: rgba(158,158,158,1);
      }

      .divider {
        height: 1px;
        background-color: #727272;
        opacity: 0.25;
        margin-left: 8px;
        margin-right: 8px;
      }

      .tooltip {
        position: relative;
      }

      .tooltip .tip {
        opacity: 0;
        visibility: hidden;
        position: absolute;
        padding: 6px 10px;
        top: 3.3em;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(-180%);
        transform: translateX(-50%) translateY(-180%);
        background: grey;
        color: white;
        white-space: nowrap;
        z-index: 2;
        border-radius: 2px;
        transition: opacity 0.2s cubic-bezier(0.64, 0.09, 0.08, 1), transform 0.2s cubic-bezier(0.64, 0.09, 0.08, 1);
      }

      .battery.tooltip .tip {
        top: 2em;
      }

      .tooltip:hover .tip, .tooltip:active .tip {
        display: block;
        opacity: 1;
        visibility: visible;
        -webkit-transform: translateX(-50%) translateY(-200%);
        transform: translateX(-50%) translateY(-200%);
      }

      .uom {
        color: var(--secondary-text-color);
        font-size: 0.9em;
        flex-shrink: 0;
        text-align: left;
        width: 30px;
        margin-right: 4px;
      }

      .sensor-row {
        display: flex;
        width: 100%;
        justify-content: space-between;
      }

      .sensor-column {
        width: 50%;
        padding-right: 12px;
        box-sizing: border-box;
      }

      .compact-mode .attribute {
        margin-bottom: 4px;
      }

      .compact-mode .meter {
        max-width: none;
      }

      .compact-mode .sensor-value,
      .compact-mode .uom {
        display: none;
      }

      .compact-mode #battery {
        top: 5px;
      }

      .compact-mode #name {
        width: calc(100% - 120px);
        max-width: 65%;
        margin-top: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .compact-mode #scientific-name {
        display: none;
      }

      /* We'll use the same header style as normal mode, but with reduced padding */
      .compact-mode .header {
        padding-top: 6px;
        height: 65px;
      }

      /* Keep the same image styling as normal mode for consistency */
      .compact-mode .header > img {
        width: 78px;
        height: 78px;
        margin-top: -24px;
        /* Other properties inherited from normal mode */
      }

      /* Reduce padding in the attributes section for compact mode */
      .compact-mode .attributes {
        padding: 2px 16px 4px;
      }
    `;

    content.id = 'container';
    content.className = this.config.display_mode === 'compact' ? 'compact-mode' : '';

    content.innerHTML = `
      <div class="header">
        <img src="${this._plantImage}" @click="${this._click.bind(this, this._stateEntityIds.plant)}">
        <span id="name" ${ this.config.state_color_plant ? `style="color:${this._getStateColor(SENSOR_TYPES.PlantState, hass)};"` : ''} @click="${this._click.bind(this, this._stateEntityIds.plant)}">${this.config.title}</span>
        <span id="battery">${this._renderBattery(hass)}</span>
        ${ this.config.show_scientific_name ? `<span id="scientific-name" @click="${this._click.bind(this, this._stateEntityIds.plant)}">${hass.states[this._otherEntityIds.scientificName]?.state || ''}</span>`: ''}
      </div>
      <div class="divider"></div>
      <div class="attributes">
        ${this._renderSensors(hass)}
      </div>
    `;
    card.appendChild(content);
    card.appendChild(style);
    root.appendChild(card);

    // Set up event delegation for click handlers
    card.addEventListener('click', (e) => {
      // Find the closest clickable element
      const clickableElement = e.target.closest('[data-entity], img, #name, #scientific-name, .battery, .attribute');
      if (clickableElement) {
        const entityId = clickableElement.dataset.entity || this._stateEntityIds.plant;
        if (entityId) {
          this._click(entityId);
          e.stopPropagation();
        }
      }
    });

    this._initialized = true;
  }

  _renderBattery(hass) {
    if (this._measurementEntityIds.battery === '') {
      return '';
    }

    const entityId = this._measurementEntityIds.battery;
    const state = parseInt(hass.states[entityId].state);

    // Check against the user-configured threshold
    const threshold = this.config?.battery_threshold ?? DEFAULT_CONFIG.battery_threshold;

    // Only show battery if level is at or below the threshold
    // Skip showing if threshold is 0 (never show)
    if (threshold === 0 || state > threshold) {
      return '';
    }

    const BATTERY_STATUS_TEXT = {
      Good: 'Good',
      Full: 'Full',
      Medium: 'Medium',
      Low: 'Low',
      VeryLow: 'Very Low',
      Critical: 'Critical',
      Unknown: 'Unknown',
    };

    const thresholdLevels = [
      { threshold: 91, icon: 'mdi:battery', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BATTERY_STATUS_TEXT.Full },
      { threshold: 81, icon: 'mdi:battery-90', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BATTERY_STATUS_TEXT.Good },
      { threshold: 71, icon: 'mdi:battery-80', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BATTERY_STATUS_TEXT.Good },
      { threshold: 61, icon: 'mdi:battery-70', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BATTERY_STATUS_TEXT.Good },
      { threshold: 51, icon: 'mdi:battery-60', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BATTERY_STATUS_TEXT.Good },
      { threshold: 41, icon: 'mdi:battery-50', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BATTERY_STATUS_TEXT.Medium },
      { threshold: 31, icon: 'mdi:battery-40', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BATTERY_STATUS_TEXT.Medium },
      { threshold: 21, icon: 'mdi:battery-30', color: 'var(--state-sensor-battery-medium-color, #ff9800)', statusText: BATTERY_STATUS_TEXT.Low },
      { threshold: 11, icon: 'mdi:battery-20', color: 'var(--state-sensor-battery-medium-color, #ff9800)', statusText: BATTERY_STATUS_TEXT.Low },
      { threshold: 6, icon: 'mdi:battery-10', color: 'var(--state-sensor-battery-low-color, #f44336)', statusText: BATTERY_STATUS_TEXT.VeryLow },
      { threshold: 0, icon: 'mdi:battery-alert', color: 'var(--state-sensor-battery-low-color, #f44336)', statusText: BATTERY_STATUS_TEXT.Critical },
      { threshold: -Infinity, icon: 'mdi:battery-alert-variant-outline', color: 'var(--state-sensor-battery-low-color, #f44336)', statusText: BATTERY_STATUS_TEXT.Unknown },
    ];

    const { icon, color, statusText } = thresholdLevels.find(({ threshold }) => state >= threshold) ||  { icon: 'mdi:battery-alert-variant-outline', color: 'var(--error-color, #F44336)', statusText: BATTERY_STATUS_TEXT.Unknown };

    return `
      <div class="battery tooltip" @click="${this._click.bind(this, entityId)}">
        <div class="tip" style="text-align:center;">Battery: ${state}%<br>Status: ${statusText}</div>
        <ha-icon icon="${icon}" style="color: ${color};"></ha-icon>
      </div>
    `;
  }

  _calculateMeterState(sensorSettings, sensorState, statusState) {
    let percentage = null;
    if (sensorState !== null && sensorSettings.min !== null && sensorSettings.max != null) {
      const calculatedPercentage = (sensorState - sensorSettings.min) / (sensorSettings.max - sensorSettings.min) * 100;
      percentage = Math.max(0, Math.min(100100, calculatedPercentage));
    }

    switch (statusState) {
      case MEASUREMENT_STATUS_STATES.TooLow: {
        return { percentage: percentage !== null ? percentage : 10, class: 'bad' };
      }
      case MEASUREMENT_STATUS_STATES.Low: {
        return { percentage: percentage !== null ? percentage : 30, class: 'warning' };
      }
      case MEASUREMENT_STATUS_STATES.Perfect: {
        return { percentage: percentage !== null ? percentage : 50, class: 'good' };
      }
      case MEASUREMENT_STATUS_STATES.High: {
        return { percentage: percentage !== null ? percentage : 70, class: 'warning' };
      }
      case MEASUREMENT_STATUS_STATES.TooHigh: {
        return { percentage: percentage !== null ? percentage : 90, class: 'bad' };
      }
      default: {
        return { percentage: 0, class: 'unavailable' };
      }
    }
  }

  _buildNutritionTooltipContent(statusState, daysUntilFertilization, lastFertilizationDateString, nextFertilizationDateString) {
    let tooltipContent = `Nutrition Status: ${statusState.replace(/_/g, ' ')}`;

    if (daysUntilFertilization !== null && !isNaN(daysUntilFertilization)) {
      if (daysUntilFertilization >= 0) {
        tooltipContent += `<br>Fertilize in ${daysUntilFertilization} ${daysText}`;
      } else {
        tooltipContent += `<br>Fertilization overdue by ${Math.abs(daysUntilFertilization)} ${daysText}`;
      }

      if (lastFertilizationDateString) {
        tooltipContent += `<br>Last Fertilization: ${this._formatDateForDisplay(lastFertilizationDateString)}`;
      }
      if (nextFertilizationDateString) {
        tooltipContent += `<br>Next Fertilization: ${this._formatDateForDisplay(nextFertilizationDateString)}`;
      }
    }

    return tooltipContent;
  }

  _renderSensors(hass) {
    // Main sensor parameters
    const visibleSensors = [];

    // Filter sensors based on configuration
    const enabledSensors = SUPPORTED_SENSORS.filter(sensorType => {
      // Translate from entity key to config key
      const configKey = `show_${sensorType}`;
      return configKey && this.config[configKey] === true;
    });

    // Add visible sensors to our collection
    enabledSensors.forEach(sensorType => {
      if (this._measurementEntityIds[sensorType] !== "") {
        visibleSensors.push({
          type: 'sensor',
          key: sensorType,
          sensorType,
          order: parseInt(this.config[`${sensorType}_order`] || '5'),
        });
      }
    });

    // Add nutrition if enabled
    if (this.config.show_nutrition && this._stateEntityIds.nutrients) {
      visibleSensors.push({
        type: 'sensor',
        key: 'nutrition',
        sensorType: 'nutrition',
        order: parseInt(this.config.nutrition_order || '5')
      });
    }

    // Sort sensors based on order
    visibleSensors.sort((a, b) => {
      // Primary sort by order
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      // Secondary sort by type name (for stable sorting when orders are equal)
      return a.sensorType.localeCompare(b.sensorType);
    });

    // Distribute items into columns considering their total number
    const leftColumnItems = [];
    const rightColumnItems = [];

    // Even number of sensors - distribute evenly
    // Odd number of sensors - always make the last item full-width
    visibleSensors.forEach((sensor, index) => {
      if (index % 2 === 0) {
        if (index === visibleSensors.length - 1) {
          // Store the sensor that should be displayed full-width
          this._fullWidthSensor = sensor;
        } else {
          leftColumnItems.push(sensor);
        }
      } else {
        rightColumnItems.push(sensor);
      }
    });

    // Render a single sensor
    const renderSensor = (item) => {
      if (item.key === 'nutrition') {
        return renderNutrition();
      }

      const sensorType = item.key;
      const sensorEntityId = this._measurementEntityIds[sensorType];
      const sensorState = hass.states[sensorEntityId].state;

      // Get proper units for display and tooltip
      const unitOfMeasurement = hass.states[sensorEntityId].attributes.unit_of_measurement || '';

      // Get the proper status entity
      let statusState = '';

      const statusEntityId = this._stateEntityIds[sensorType];
      if (statusEntityId) {
        statusState = hass.states[statusEntityId].state;
      }

      const color = this._getStateColor(sensorType, hass);
      const sensorSettings = SENSOR_SETTINGS[sensorType];

      // Calculate meter width and class based on status
      const meterState = this._calculateMeterState(sensorSettings, sensorState, statusState);

      // Generate tooltip content with current value and status - use full unit
      const tooltipContent = `${sensorSettings.name}: ${sensorState} ${unitOfMeasurement}${statusState ? `<br>Status: ${statusState.replace(/_/g, ' ')}` : ''}`;

      return `
        <div class="attribute tooltip" @click="${this._click.bind(this, sensorEntityId)}" data-entity="${sensorEntityId}">
          <div class="tip" style="text-align:center;">${tooltipContent}</div>
          <ha-icon icon="${sensorSettings.icon}" ${this.config.state_color_icon ? `style="color:${color};"`: ''}></ha-icon>
          <div class="meter">
            <span ${this.config.state_color_sensor ? `class="${meterState.class}"` : ''} style="width: ${meterState.percentage}%;"></span>
          </div>
          <div class="sensor-value">${sensorState}</div>
          <div class="uom">${this._formatDisplayUnit(unitOfMeasurement)}</div>
        </div>
      `;
    };

    // Render nutrition status
    const renderNutrition = () => {
      const statusEntityId = this._stateEntityIds.nutrients;
      const statusState = hass.states[statusEntityId]?.state;
      const color = this._getStateColor(SENSOR_TYPES.NutrientsState, hass);

      // Get fertilizations date if available
      const fertiliseLastEntityId = this._otherEntityIds.fertiliseLast;
      const fertiliseNextEntityId = this._otherEntityIds.fertiliseNext;
      let daysUntilFertilization = null;
      let lastFertilizationDateString = null;
      let nextFertilizationDateString = null;

      if (fertiliseNextEntityId && hass.states[fertiliseNextEntityId]) {
        nextFertilizationDateString = hass.states[fertiliseNextEntityId].state;
        daysUntilFertilization = this._calculateDaysFromNow(nextFertilizationDateString);
      }

      if (fertiliseLastEntityId && hass.states[fertiliseLastEntityId]) {
        lastFertilizationDateString = hass.states[fertiliseLastEntityId].state;
      }

      // Format the next fertilization date for display
      const meterState = this._calculateMeterState(SENSOR_SETTINGS[SENSOR_TYPES.Nutrients], null, statusState);

      // Build tooltip content
      const tooltipContent = this._buildNutritionTooltipContent(statusState, daysUntilFertilization, lastFertilizationDateString, nextFertilizationDateString);
      const sensorValue = daysUntilFertilization !== null && !isNaN(daysUntilFertilization) ? daysUntilFertilization : '-';

      return `
        <div class="attribute tooltip" @click="${this._click.bind(this, statusEntityId)}" data-entity="${statusEntityId}">
          <div class="tip" style="text-align:center;">${tooltipContent}</div>
          <ha-icon icon="${SENSOR_SETTINGS[SENSOR_TYPES.Nutrients].icon}" ${this.config.state_color_icon ? `style="color:${color};"` : ''}></ha-icon>
          <div class="meter">
            <span ${this.config.state_color_sensor ? `class="${meterState.class}"` : ''} style="width: ${meterState.percentage}%;"></span>
          </div>
          <div class="sensor-value">${sensorValue}</div>
          <div class="uom">${Math.abs(daysUntilFertilization) === 1 ? 'day' : 'days'}</div>
        </div>
      `;
    };

    // Create HTML for both columns
    let leftColumnHtml = leftColumnItems.map(renderSensor).join('');
    let rightColumnHtml = rightColumnItems.map(renderSensor).join('');

    // Check if we need a full-width row
    const needsFullWidthItem = leftColumnItems.some(item => item.type === 'full-width-placeholder');

    let fullWidthItemHtml = "";
    if (needsFullWidthItem && this._fullWidthSensor) {
      if (this._fullWidthSensor.key === 'nutrition') {
        fullWidthItemHtml = renderNutrition();
      } else {
        fullWidthItemHtml = renderSensor(this._fullWidthSensor);
      }
    }

    // Construct final HTML
    let sensorHtml = `
      <div class="sensor-row">
        <div class="sensor-column">
          ${leftColumnHtml}
        </div>
        <div class="sensor-column">
          ${rightColumnHtml}
        </div>
      </div>
    `;

    // Add full-width item if needed
    if (fullWidthItemHtml) {
      sensorHtml += fullWidthItemHtml;
    }

    return sensorHtml;
  }

  _updateDisplayValues(hass) {
    // Update plant status and title
    const nameElement = this.shadowRoot.querySelector('#name');
    if (nameElement) {
      nameElement.textContent = this.config.title;
      if (this.config.state_color_plant) {
        nameElement.style.color = this._getStateColor(SENSOR_TYPES.PlantState, hass);
      }
    }

    // Update battery
    const batteryElement = this.shadowRoot.querySelector('#battery');
    if (batteryElement) {
      batteryElement.innerHTML = this._renderBattery(hass);
    }

    // Update scientific name
    const scientificNameElement = this.shadowRoot.querySelector('#scientific-name');
    if (scientificNameElement) {
      scientificNameElement.textContent = hass.states[this._otherEntityIds.scientificName]?.state || "";
    }

    // Update sensor values - include all sensor types
    SUPPORTED_SENSORS.forEach(sensorType => {
      const entityId = this._measurementEntityIds[sensorType];

      // Skip if no entity
      if (entityId === '') return;

      const sensorElement = this.shadowRoot.querySelector(`.attribute[data-entity="${entityId}"]`);

      if (sensorElement) {
        const sensorSettings = SENSOR_SETTINGS[sensorType];
        const sensorState = hass.states[entityId].state;
        const unitOfMeasurement = hass.states[entityId].attributes.unit_of_measurement || '';

        const iconElement = sensorElement.querySelector('ha-icon');
        if (iconElement && this.config.state_color_icon) {
          iconElement.style.color = this._getStateColor(sensorType, hass);
        }

        const valueElement = sensorElement.querySelector('.sensor-value');
        if (valueElement) {
          valueElement.textContent = sensorState;
        }

        const uomElement = sensorElement.querySelector('.uom');
        if (uomElement) {
          // Get unit from entity and simplify for display
          uomElement.textContent = this._formatDisplayUnit(unitOfMeasurement);;
        }

        const meterElement = sensorElement.querySelector('.meter span');
        if (meterElement) {
          // Get the proper status entity
          let statusState = '';

          const statusEntityId = this._stateEntityIds[sensorType];
          if (statusEntityId) {
            statusState = hass.states[statusEntityId].state;
          }

          // Calculate meter width and class based on status
          const meterState = this._calculateMeterState(sensorSettings, sensorState, statusState);
          meterElement.style.width = `${meterState.percentage}%`;
          if (this.config.state_color_sensor) {
            meterElement.className = meterState.class;
          }

          // Update tooltip with current values
          const tooltipElement = sensorElement.querySelector('.tip');
          if (tooltipElement) {
            // Tooltip content with full unit
            const tooltipContent = `${sensorSettings.name}: ${sensorState} ${unitOfMeasurement}${statusState ? `<br>Status: ${statusState.replace(/_/g, ' ')}` : ''}`;

            tooltipElement.innerHTML = tooltipContent;
          }
        }
      }
    });

    // Also update nutrition
    if (this._stateEntityIds.nutrients) {
      // Find the nutrition element
      const nutritionElement = this.shadowRoot.querySelector(`.attribute[data-entity="${this._stateEntityIds.nutrients}"]`);

      if (nutritionElement) {
        const statusEntity = this._stateEntityIds.nutrients;
        const statusState = hass.states[statusEntity].state;
        const iconElement = nutritionElement.querySelector('ha-icon');
        const meterElement = nutritionElement.querySelector('.meter span');
        const valueElement = nutritionElement.querySelector('.sensor-value');

        // Get next fertilization date if available
        const { fertiliseLast: fertiliseLastEntityId, fertiliseNext: fertiliseNextEntityId } = this._otherEntityIds;
        let daysUntilFertilization = null;
        let lastFertilizationDateString = null;
        let nextFertilizationDateString = null;

        if (fertiliseNextEntityId && hass.states[fertiliseNextEntityId]) {
          nextFertilizationDateString = hass.states[fertiliseNextEntityId].state;
          daysUntilFertilization = this._calculateDaysFromNow(nextFertilizationDateString);
        }

        if (fertiliseLastEntityId && hass.states[fertiliseLastEntityId]) {
          lastFertilizationDateString = hass.states[fertiliseLastEntityId].state;
        }

        if (iconElement) {
          if (this.config.state_color_icon) {
            iconElement.style.color = this._getStateColor(SENSOR_TYPES.NutrientsState, hass);
          }
        }

        if (valueElement) {
          valueElement.textContent = daysUntilFertilization !== null && !isNaN(daysUntilFertilization) ? daysUntilFertilization : '-';
        }

        if (meterElement) {
          // Calculate meter width and class based on status
          const meterState = this._calculateMeterState(SENSOR_SETTINGS[SENSOR_TYPES.Nutrients], null, statusState);
          meterElement.style.width = `${meterState.percentage}%`;
          if (this.config.state_color_sensor) {
            meterElement.className = meterState.class;
          }
        }

        // Update tooltip with current values
        const tooltipElement = nutritionElement.querySelector('.tip');
        if (tooltipElement) {
          tooltipElement.innerHTML = this._buildNutritionTooltipContent(statusState, daysUntilFertilization, lastFertilizationDateString, nextFertilizationDateString);
        }
      }
    }
  }

  // Format unit for card display (only show part before "/" if it exists)
  _formatDisplayUnit(unit) {
    if (!unit) return '';
    const parts = unit.split('/');
    return parts[0];
  }
}

customElements.define('fyta-plant-card', FytaPlantCard);


export class FytaPlantCardEditor extends LitElement {

  static properties = {
    hass: { type: Object },
    config: { state: true }
  };

  get _device_id() {
    return this.config?.device_id || '';
  }

  _computeLabel(schema) {
    // The schema already has labels, but for grids we need this function
    // to ensure proper display of field names
    return schema.label || schema.name;
  }

  _itemMoved(ev) {
    ev.stopPropagation();

    // TODO: Implement
  }

  _valueChanged(ev) {
    if (!this.config || !this.hass) {
      return;
    }

    // Start with a fresh object with all defaults
    const newConfig = { ...DEFAULT_CONFIG };

    // Copy existing config
    if (this.config) {
      Object.keys(this.config).forEach(key => {
        if (this.config[key] !== undefined &&
            key !== 'display_options' &&
            key !== 'show_ec' &&
            key !== 'sensor_order' &&
            !key.includes('_priority') &&
            !key.includes('_position')) {
          newConfig[key] = this.config[key];
        }
      });
    }

    // Then add the new values
    let orderChanged = false;
    let changedType = '';
    let oldValue = '';
    let newValue = '';

    if (ev.detail.value) {
      Object.keys(ev.detail.value).forEach(key => {
        // Special handling for order changes
        if (key.includes('_order')) {
          if (newConfig[key] !== ev.detail.value[key]) {
            orderChanged = true;
            changedType = key.split('_')[0]; // Extract sensor type (light, moisture, etc.)
            oldValue = newConfig[key];
            newValue = ev.detail.value[key];
          }
        }
        newConfig[key] = ev.detail.value[key];
      });
    }

    // If an order value was changed, find if any other sensor has the same new value
    // and swap them to maintain uniqueness
    if (orderChanged) {
      const sensorTypes = [SENSOR_TYPES.Light, SENSOR_TYPES.Moisture, SENSOR_TYPES.Temperature, SENSOR_TYPES.Salinity, SENSOR_TYPES.Nutrients];

      sensorTypes.forEach(type => {
        if (type !== changedType) {
          const orderKey = `${type}_order`;

          // If another sensor has the same order value as the new one, swap them
          if (newConfig[orderKey] === newValue) {
            newConfig[orderKey] = oldValue;
          }
        }
      });
    }

    // Special handling for device_id
    if (ev.detail.value.device_id !== undefined && ev.detail.value.device_id !== this._device_id) {
      if (ev.detail.value.device_id === '') {
        newConfig.title = '';
      } else if (newConfig.title === '') {
        try {
          const device = this.hass.devices[ev.detail.value.device_id];
          if (device && device.name) {
            newConfig.title = device.name;
          }
        } catch (e) {
          console.error('Error setting title from selected device:', e);
        }
      }
    }

    this.configChanged(newConfig);
  }

  configChanged(newConfig) {
    const event = new Event('config-changed', {
      bubbles: true,
      composed: true
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    // Create a safe copy for the form to use - ensure all properties exist
    const formData = {
      ...DEFAULT_CONFIG,
      ...this.config,
    };

    return html`
      <div class="card-config">
        <div class="side-by-side">
          <ha-form
            .hass=${this.hass}
            .data=${formData}
            .schema=${SCHEMA}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
          <ha-sortable handle-selector=".handle" @item-moved=${this._entityMoved}>
            ${[1,2,3,4,5].map((value) => html`
              <div>
                <div class="handle">
                  <ha-icon icon="mid:drag"></ha-svg-icon>
                </div>
                <div class="item">${value}</div>
            `)};
            </div>
          </ha-sortable>
        </div>
      </div>
    `;
  }

  setConfig(config) {
    // Start with a fresh object with all defaults set
    const newConfig = parseConfig(config);

    if (newConfig.device_id !== '' && newConfig.title === '' && this.hass) {
      try {
        const device = this.hass.devices[newConfig.device_id];
        if (device && device.name) {
          newConfig.title = device.name;
        }
      } catch (e) {
        console.error('Error setting title from selected device:', e);
      }
    }

    // Ensure at least one option is selected
    const hasSelection =
      newConfig.show_light ||
      newConfig.show_moisture ||
      newConfig.show_temperature ||
      newConfig.show_salinity ||
      newConfig.show_nutrition;

    if (!hasSelection) {
      // Default to showing all if nothing selected
      newConfig.show_light = true;
      newConfig.show_moisture = true;
      newConfig.show_temperature = true;
      newConfig.show_salinity = false;
      newConfig.show_nutrition = true;
    }

    this.config = newConfig;
  }
}

customElements.define('fyta-plant-card-editor', FytaPlantCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'fyta-plant-card',
  name: 'FYTA Plant Card',
  preview: true,
  description: 'Custom card for your FYTA plant data',
});
