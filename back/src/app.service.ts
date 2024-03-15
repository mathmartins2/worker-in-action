import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyEntity } from './entity';
import { Response } from 'express';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(MyEntity)
    private readonly yourEntityRepository: Repository<MyEntity>,
  ) {}

  async streamData(response: Response) {
    const take = 1000000;
    const subject = new Subject();

    const query = this.yourEntityRepository
      .createQueryBuilder('entity')
      .take(take);
    const stream = await query.stream();

    let processedCount = 0;

    stream.on('data', (data) => {
      processedCount++;
      const progressPercent = Math.round((processedCount / take) * 100);
      console.log('data', data);
      console.log(`Total count: ${take}, Processed count: ${processedCount}`);
      console.log(`Progress: ${progressPercent}%`);
      response.write(
        `data: ${JSON.stringify({
          data,
          progressPercent,
        })}\n\n`,
      );
    });

    stream.on('end', () => {
      response.write('event: stream-end\ndata: {}\n\n');
      response.end();
    });

    return subject.asObservable();
  }
}
