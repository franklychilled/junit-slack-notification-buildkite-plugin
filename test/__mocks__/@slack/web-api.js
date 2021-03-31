// __mocks__/@slack/web-api.js
class WebClient {
    constructor(token) {
        // do nothing
        console.log(`Call constructor with ${token}`);
    }

    chat = {
        postMessage: jest.fn(() => ({promise: true}))
    };
}
