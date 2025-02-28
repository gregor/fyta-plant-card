# HomeAssistant Fyta Plant Card
Custom card to display information of [Fyta plants](https://fyta.de/) on your Home Assistant dashboard.

You will need the [Fyta integration](https://www.home-assistant.io/integrations/fyta/) installed to use this card.

![Screenshot](https://raw.githubusercontent.com/dontinelli/fyta-plant-card/main/images/card-image.png)

## Preliminary note

Please note that this card still is in (early) development. Please report any bugs or malfunctions of the custom card [here](https://github.com/dontinelli/fyta-plant-card/issues). For problems with the fyta integration itself, please use the issue-tracker of the integration.

## Installation

1. Download `fyta-plant-card.js` from the [latest release](https://github.com/dontinelli/fyta-plant-card/releases) and move this file to the `config/www` folder.
2. Ensure you have advanced mode enabled (accessible via your username in the bottom left corner)
3. Go to Configuration -> Lovelace Dashboards -> Resources.
4. Add `/local/fyta-plant-card.js` with type JS module.
5. Refresh the page? Or restart Home Assistant? The card should eventually be there.

## Options

The custom card comes with a visual card editor, which in particular facilitates the selection of the desired fyta plant.

For configuration in YAML-mode, the following paramenters must/may be set:

| Name              | Type    | Requirement  | Description                                                          |
| ----------------- | ------- | ------------ | -------------------------------------------------------------------- |
| type              | string  | **Required** | `custom:fyta-plant-card`, is automatically set in ui-mode            |
| device            | string  | **Required** | Device id of the plant in Home Assistant                             |
| title             | string  | **Optional** | Card title (by default this will be the plant name)                  |
