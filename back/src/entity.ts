import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
