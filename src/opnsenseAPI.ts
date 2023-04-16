import axios, {AxiosInstance} from 'axios';
import * as https from 'https';

/*
  See https://docs.opnsense.org/development/api/plugins/firewall.html for details
  regarding the OpnSense firewall API
 */
export class opnsenseAPI {
  private api: AxiosInstance;

  constructor(
    private readonly host: string,
    private readonly apiKey: string,
    private readonly apiSecret: string,
    private readonly allowInvalidCert: boolean,
  ) {
    const agent = new https.Agent({
      host: host,
      keepAlive: true,
      // Will allow invalid https cert to that host only
      rejectUnauthorized: !this.allowInvalidCert,
    });
    this.api = axios.create({
      auth: {
        username: apiKey,
        password: apiSecret,
      },
      baseURL: `https://${host}`,
      httpsAgent: agent,
    });
  }

  async setEnabledStateFirewallRule(uuid: string, state: boolean) {
    await this.api.post(`/api/firewall/filter/toggleRule/${uuid}/${state ? 1 : 0}`);
    await this.api.post('/api/firewall/filter/apply');
  }

  async getFirewallRuleState(uuid: string): Promise<boolean> {
    const response = await this.api.get(`/api/firewall/filter/getRule/${uuid}`);
    return (response.data.rule ?? {}).enabled === '1';
  }
}
