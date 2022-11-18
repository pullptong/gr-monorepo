import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Finding, Status } from '../scan-result.interface';

@Entity('scan_result')
export class ScanResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Status, default: Status.Queued })
  status: Status;

  @Column({ name: 'repository_name' })
  repositoryName: string;

  @Column({ type: 'jsonb', default: [] })
  findings: Finding[];

  @Column({ name: 'queued_at', type: 'timestamp' })
  queuedAt: Date;

  @Column({ name: 'scanning_at', type: 'timestamp' })
  scanningAt: Date;

  @Column({ name: 'finished_at', type: 'timestamp' })
  finishedAt: Date;
}
