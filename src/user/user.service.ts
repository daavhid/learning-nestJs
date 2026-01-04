import { Injectable } from '@nestjs/common';
import { HelloService } from 'src/hello/hello.service';


export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "editor" | "moderator";
  isActive: boolean;
  createdAt: string; // ISO date string
}

@Injectable()
export class UserService {
    private users:User[]
    constructor(private readonly helloService :HelloService){
        this.users = [
                {
                    "id": "1",
                    "name": "David Victor",
                    "email": "david.victor@example.com",
                    "role": "admin",
                    "isActive": true,
                    "createdAt": "2025-01-12T10:15:30Z"
                },
                {
                    "id": "2",
                    "name": "Sarah Johnson",
                    "email": "sarah.johnson@example.com",
                    "role": "user",
                    "isActive": true,
                    "createdAt": "2025-01-14T09:40:12Z"
                },
                {
                    "id": "3",
                    "name": "Michael Brown",
                    "email": "michael.brown@example.com",
                    "role": "user",
                    "isActive": false,
                    "createdAt": "2025-01-18T14:05:50Z"
                },
                {
                    "id": "4",
                    "name": "Amina Yusuf",
                    "email": "amina.yusuf@example.com",
                    "role": "editor",
                    "isActive": true,
                    "createdAt": "2025-01-20T08:22:11Z"
                },
                {
                    "id": "5",
                    "name": "John Okafor",
                    "email": "john.okafor@example.com",
                    "role": "user",
                    "isActive": true,
                    "createdAt": "2025-01-23T16:45:00Z"
                },
                {
                    "id": "6",
                    "name": "Grace Williams",
                    "email": "grace.williams@example.com",
                    "role": "moderator",
                    "isActive": false,
                    "createdAt": "2025-01-25T11:10:27Z"
                },
                {
                    "id": "7",
                    "name": "Samuel Ade",
                    "email": "samuel.ade@example.com",
                    "role": "user",
                    "isActive": true,
                    "createdAt": "2025-01-28T13:55:42Z"
                },
                {
                    "id": "8",
                    "name": "Linda Martinez",
                    "email": "linda.martinez@example.com",
                    "role": "editor",
                    "isActive": true,
                    "createdAt": "2025-02-01T09:30:19Z"
                },
                {
                    "id": "9",
                    "name": "Daniel Kim",
                    "email": "daniel.kim@example.com",
                    "role": "user",
                    "isActive": false,
                    "createdAt": "2025-02-03T17:05:58Z"
                },
                {
                    "id": "10",
                    "name": "Fatima Bello",
                    "email": "fatima.bello@example.com",
                    "role": "admin",
                    "isActive": true,
                    "createdAt": "2025-02-05T12:00:00Z"
                }
                ]

    }
    

    getAllUsers(){
        return this.users
    }

    getUserById(id:number){
        const user = this.users.find((user)=> Number(user.id) === id )
        return user
    }

    getUserwelcomeMessage(id:number){
        const user = this.getUserById(id)
        return this.helloService.getHelloMessage(user?.name!)
    }
}
