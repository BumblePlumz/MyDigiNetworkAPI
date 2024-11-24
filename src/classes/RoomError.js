export class RoomError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}