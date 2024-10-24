export class RoomError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code ?? 500;
        this.message = message ?? 'Internal server error';
    }
}