# mypincode-api

JavaScript client for the **MyPincode API**.

`mypincode-api` provides a simple way to access Indian PIN code information from Node.js and modern JavaScript applications.

## Features

- Simple API
- No API key required
- No authentication required
- Native `fetch()` support
- No runtime dependencies
- Request timeout handling
- API error handling

## Installation

Install the package using npm:

```bash
npm install mypincode-api
```

## Basic Usage

```js
import MyPincode from "mypincode-api";

const api = new MyPincode();

const result = await api.get("422001");

console.log(result);
```

## Get PIN Code Information

Use the `get()` method to retrieve information about a PIN code.

```js
const result = await api.get("422001");

console.log(result);
```

Example response:

```json
[
    {
        "pincode": 422001,
        "area": "Nashik main road ",
        "state": "Maharashtra",
        "district": "Nashik",
        "region": "Navi mumbai",
        "circle": "Maharashtra"
    },
    {
        "pincode": 422001,
        "area": "Nashik ",
        "state": "Maharashtra",
        "district": "Nashik",
        "region": "Navi mumbai",
        "circle": "Maharashtra"
    }
]
```

You can access the returned information like this:

```js
const result = await api.get("422001");

for (const i in result) {
    console.log("PIN Code:", pincode[i].pincode);
    console.log("State:", pincode[i].state);
    console.log("District:", pincode[i].district);
}
```

## Complete Example

```js
import MyPincode from "mypincode-api";

const api = new MyPincode();

async function main() {
    try {
        const result = await api.get("422001");

        for (const i in result) {
            console.log("PIN Code:", pincode[i].pincode);
            console.log("State:", pincode[i].state);
            console.log("District:", pincode[i].district);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();
```

## Handling Errors

The package provides a `MyPincodeError` class for API errors.

```js
import MyPincode, {
    MyPincodeError
} from "mypincode-api";

const api = new MyPincode();

try {
    const result = await api.get("425003");

    console.log(result);
} catch (error) {
    if (error instanceof MyPincodeError) {
        console.error("API Error:", error.message);
        console.error("Status:", error.status);
    } else {
        console.error("Unexpected Error:", error.message);
    }
}
```

## Invalid PIN Code

If an invalid or unavailable PIN code is requested, the API may return an error.

```js
try {
    const result = await api.get("000000");

    console.log(result);
} catch (error) {
    console.error(error.message);
}
```

## Request Timeout

The default request timeout is **10 seconds**.

You can customize the timeout:

```js
const api = new MyPincode({
    timeout: 5000
});
```

The value is specified in milliseconds.

```text
5000  = 5 seconds
10000 = 10 seconds
30000 = 30 seconds
```

## Custom API URL

The package uses the MyPincode API by default.

You can provide a custom API URL if required:

```js
const api = new MyPincode({
    baseUrl: "https://mypincode.live/api/pincode/{pincode}"
});
```

This can be useful for development, testing, or self-hosted API environments.

## Rate Limit

The MyPincode API currently allows up to **1,000 requests per day**.

```text
Daily limit: 1,000 requests
```

If your application exceeds the daily limit, the API will return an appropriate rate-limit response.

You can handle this using the HTTP status code:

```js
try {
    const result = await api.get("425003");

    console.log(result);
} catch (error) {
    if (error.status === 429) {
        console.error("Daily API request limit exceeded.");
    } else {
        console.error(error.message);
    }
}
```

Avoid repeatedly retrying requests after receiving a rate-limit response.

## API Response

A successful request returns information about the requested PIN code.

Example:

```json
[
    {
        "pincode": 422001,
        "area": "Nashik main road ",
        "state": "Maharashtra",
        "district": "Nashik",
        "region": "Navi mumbai",
        "circle": "Maharashtra"
    },
    {
        "pincode": 422001,
        "area": "Nashik ",
        "state": "Maharashtra",
        "district": "Nashik",
        "region": "Navi mumbai",
        "circle": "Maharashtra"
    }
]
```

The exact fields available in `data` depend on the information provided by the MyPincode API.

## License

MIT

## Links

[Api Documetation](https://mypincode.live/api-documentation)

## Support

If you have questions or encounter an issue while using `mypincode-api`, contact the MyPincode support team.