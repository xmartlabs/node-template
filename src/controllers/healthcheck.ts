import { Controller, Get, Route } from 'tsoa';

@Route('v1/healthcheck')
export class HealthCheckControllerV1 extends Controller {
  @Get('/')
  public async checkHealth(): Promise<void> {
    this.setStatus(200);
  }
}
