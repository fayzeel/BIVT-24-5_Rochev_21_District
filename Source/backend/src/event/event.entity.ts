import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { District } from '../district/district.entity';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'date' })
  event_date!: Date;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => District, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'district_id' })
  district!: District;
}