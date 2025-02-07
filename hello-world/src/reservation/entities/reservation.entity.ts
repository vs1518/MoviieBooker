import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { Movie } from '../../movies/movie.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @Column()
  movieTitle: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Movie)
  movie: Movie;
}