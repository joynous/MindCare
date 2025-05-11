declare module '@getbrevo/brevo' {
  export class Configuration {
    constructor(config: { apiKey: string });
  }
  
  export class TransactionalEmailsApi {
    constructor(config: Configuration);
    sendTransacEmail(email: any): Promise<any>;
  }
}