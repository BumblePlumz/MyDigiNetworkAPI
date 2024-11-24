export class UserError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}