import {CharacteristicValue, PlatformAccessory, Service} from 'homebridge';

import {OpnSenseHomebridgePlatform} from './platform';
import {opnsenseAPI} from './opnsenseAPI';
import {AxiosError} from 'axios';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class OpnSensePlatformAccessory {
  private service: Service;

  constructor(
    private readonly platform: OpnSenseHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
    private readonly opnSenseAPI: opnsenseAPI,
    private readonly uuid: string,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'OpnSense')
      .setCharacteristic(this.platform.Characteristic.Model, 'OpnSenseFirewallRule')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, uuid);

    // get the Switch service if it exists, otherwise create a new LightBulb service
    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.Switch) || this.accessory.addService(this.platform.Service.Switch);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.fwRule.name);

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Switch

    // register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.On)
      .onSet(this.setOn.bind(this))                // SET - bind to the `setOn` method below
      .onGet(this.getOn.bind(this));               // GET - bind to the `getOn` method below
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setOn(value: CharacteristicValue) {
    try {
      await this.opnSenseAPI.setEnabledStateFirewallRule(this.uuid, value === true);
    } catch (e) {
      if (e instanceof AxiosError) {
        this.platform.log.error('http error', e.toJSON());
      } else {
        this.platform.log.error('unknown error', typeof e);
      }
    }
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   *
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   *
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  async getOn(): Promise<CharacteristicValue> {
    try {
      return await this.opnSenseAPI.getFirewallRuleState(this.uuid);
    } catch (e) {
      if (e instanceof AxiosError) {
        this.platform.log.error('http error', e.toJSON());
      } else {
        this.platform.log.error('unknown error', typeof e);
      }
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }
}
