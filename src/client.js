import { MyPincodeError } from "./errors.js";

class MyPincode {
    constructor(options = {}) {
        const {
            baseUrl = "https://mypincode.test/api",
            timeout = 10000
        } = options;

        this.baseUrl = baseUrl.replace(/\/+$/, "");
        this.timeout = timeout;
    }

    async request(endpoint, options = {}) {
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, this.timeout);

        try {
            const response = await fetch(
                `${this.baseUrl}${endpoint}`,
                {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        Accept: "application/json",
                        ...options.headers
                    }
                }
            );

            let data;

            try {
                data = await response.json();
            } catch {
                throw new MyPincodeError(
                    "Invalid JSON response from MyPincode API.",
                    response.status
                );
            }

            if (!response.ok) {
                throw new MyPincodeError(
                    data.message || "MyPincode API request failed.",
                    response.status,
                    data
                );
            }

            return data;
        } catch (error) {
            if (error.name === "AbortError") {
                throw new MyPincodeError(
                    "MyPincode API request timed out."
                );
            }

            if (error instanceof MyPincodeError) {
                throw error;
            }

            throw new MyPincodeError(
                error.message || "Unable to connect to MyPincode API."
            );
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async get(pincode) {
        if (!pincode) {
            throw new Error("Pincode is required.");
        }

        return this.request(
            `/pincode/${encodeURIComponent(pincode)}`
        );
    }
}

export default MyPincode;