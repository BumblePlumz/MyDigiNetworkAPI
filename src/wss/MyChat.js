import { Server } from "socket.io";

const rooms = ['room1', 'room2', 'room3'];

export class MyChat extends Server {
    constructor(port) {
        super(port, {
            cors: {
                origin: '*',
            }
        });
        this.Init();
    }

    Init() {
        rooms.forEach(room => {
            this.of(room).on('connection', (socket) => {
                console.log('a user connected to ' + room);
                socket.on('message', (msg) => {
                    console.log(msg);
                    this.of(room).emit('message', msg);
                });

            });
        });
    }

    
}