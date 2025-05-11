declare module '@getbrevo/brevo' {
  export class Configuration {
    constructor(config: { apiKey: string });
  }
  
  export class TransactionalEmailsApi {
    constructor(config: Configuration);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendTransacEmail(email: any): Promise<any>;
  }
}