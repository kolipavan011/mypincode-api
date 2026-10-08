export class MyPincodeError extends Error {
    constructor(message, status = null, data = null) {
        super(message);

        this.name = "MyPincodeError";
        this.status = status;
        this.data = data;
    }
}