import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  method: HttpMethod;
}
