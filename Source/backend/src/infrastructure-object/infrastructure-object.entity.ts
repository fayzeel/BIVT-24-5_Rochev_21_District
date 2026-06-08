import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { District } from '../district/district.entity';
import { InfrastructureType } from '../infrastructure-type/infrastructure-type.entity';

@Entity('infrastructure_object')
export class InfrastructureObject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  address!: string;

  @Column({ type: 'int', nullable: true })
  foundation_year!: number;

  @ManyToOne(() => District, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'district_id' })
  district!: District;

  @ManyToOne(() => InfrastructureType, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'type_id' })
  type!: InfrastructureType;
}