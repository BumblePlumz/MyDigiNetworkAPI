export class MessageError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}