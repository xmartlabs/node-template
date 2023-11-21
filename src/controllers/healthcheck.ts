import {
  Controller,
  Get,
  Route,
} from 'tsoa';

@Route('healthcheck')
export class HealthCheckController extends Controller {
  @Get('/')
  public async checkHealth(): Promise<void> {
    this.setStatus(200);
  }
}
