import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('district')
export class District {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  area_km2!: number;

  @Column({ type: 'int' })
  population!: number;

  @Column({ type: 'int' })
  foundation_year!: number;

  @Column({ type: 'text', nullable: true })
  description!: string;
}