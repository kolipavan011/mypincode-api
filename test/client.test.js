import test from "node:test";
import assert from "node:assert/strict";

import MyPincode from "../src/client.js";
import { MyPincodeError } from "../src/errors.js";

test("creates a MyPincode client", () => {
    const api = new MyPincode();

    assert.equal(api.baseUrl, "https://mypincode.com/api");
    assert.equal(api.timeout, 10000);
});

test("removes trailing slash from base URL", () => {
    const api = new MyPincode({
        baseUrl: "https://example.com/api/"
    });

    assert.equal(api.baseUrl, "https://example.com/api");
});

test("uses custom timeout", () => {
    const api = new MyPincode({
        timeout: 5000
    });

    assert.equal(api.timeout, 5000);
});

test("get() requires a pincode", async () => {
    const api = new MyPincode();

    await assert.rejects(
        () => api.get(),
        {
            message: "Pincode is required."
        }
    );
});

test("get() requires a valid value", async () => {
    const api = new MyPincode();

    await assert.rejects(
        () => api.get(""),
        {
            message: "Pincode is required."
        }
    );
});

test("get() requests the correct endpoint", async () => {
    const originalFetch = globalThis.fetch;

    let requestedUrl = null;

    globalThis.fetch = async (url) => {
        requestedUrl = url;

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    pincode: "425003",
                    state: "Maharashtra",
                    district: "Jalgaon"
                }
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    };

    try {
        const api = new MyPincode();

        const result = await api.get("425003");

        assert.equal(
            requestedUrl,
            "https://mypincode.com/api/pincode/425003"
        );

        assert.equal(result.success, true);
        assert.equal(result.data.pincode, "425003");
        assert.equal(result.data.state, "Maharashtra");
        assert.equal(result.data.district, "Jalgaon");
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("encodes pincode in URL", async () => {
    const originalFetch = globalThis.fetch;

    let requestedUrl = null;

    globalThis.fetch = async (url) => {
        requestedUrl = url;

        return new Response(
            JSON.stringify({
                success: true
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    };

    try {
        const api = new MyPincode();

        await api.get("425 003");

        assert.equal(
            requestedUrl,
            "https://mypincode.com/api/pincode/425%20003"
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("throws MyPincodeError for API errors", async () => {
    const originalFetch = globalThis.fetch;

    globalThis.fetch = async () => {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Pincode not found."
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    };

    try {
        const api = new MyPincode();

        await assert.rejects(
            () => api.get("000000"),
            (error) => {
                assert.ok(error instanceof MyPincodeError);
                assert.equal(error.message, "Pincode not found.");
                assert.equal(error.status, 404);

                return true;
            }
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("throws MyPincodeError for rate limit", async () => {
    const originalFetch = globalThis.fetch;

    globalThis.fetch = async () => {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Daily request limit exceeded."
            }),
            {
                status: 429,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    };

    try {
        const api = new MyPincode();

        await assert.rejects(
            () => api.get("425003"),
            (error) => {
                assert.ok(error instanceof MyPincodeError);
                assert.equal(error.status, 429);
                assert.equal(
                    error.message,
                    "Daily request limit exceeded."
                );

                return true;
            }
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("throws error when API returns invalid JSON", async () => {
    const originalFetch = globalThis.fetch;

    globalThis.fetch = async () => {
        return new Response("invalid json", {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    };

    try {
        const api = new MyPincode();

        await assert.rejects(
            () => api.get("425003"),
            (error) => {
                assert.ok(error instanceof MyPincodeError);
                assert.equal(
                    error.message,
                    "Invalid JSON response from MyPincode API."
                );

                return true;
            }
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});