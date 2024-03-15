import { Controller, Res, Sse } from '@nestjs/common';
import { ReportService } from './app.service';
import { Response } from 'express';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Sse('stream')
  streamReport(@Res() res: Response) {
    return this.reportService.streamData(res);
  }
}
