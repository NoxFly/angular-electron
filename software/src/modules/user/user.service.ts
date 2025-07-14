import { Injectable, NotFoundException } from "@noxfly/noxus";
import { User } from "modules/user/dto/user.dto";

@Injectable()
export class UserService {
    private readonly users: User[] = [
        {
            id: "1",
            username: "admin",
            password: "test",
            email: "admin@example.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    public async findAll(): Promise<User[]> {
        return this.users;
    }

    public async findOneById(id: string): Promise<User> {
        const user = this.users.find(user => user.id === id);

        if(!user) {
            throw new NotFoundException();
        }

        return user;
    }

    public async findOneByUsername(username: string): Promise<User> {
        const user = this.users.find(user => user.username === username);

        if(!user) {
            throw new NotFoundException();
        }

        return user;
    }
}