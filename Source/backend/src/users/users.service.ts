import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

// Интерфейс пользователя (как в задании)
export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

@Injectable()
export class UsersService {
  // Хранилище в памяти (очищается при перезапуске сервера)
  private users: User[] = [];
  private currentId = 1;

  // GET /users
  findAll(): User[] {
    return this.users;
  }

  // GET /users/:id
  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  // POST /users
  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.currentId++,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }
}