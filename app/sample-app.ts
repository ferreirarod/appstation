import App from "./app";

class SampleApp extends App {

    constructor() {
        super("sample-app", "Sample App", "Sample Idea to test if this hole idea works");
    }

    protected getInnerHTML(): string {
        return "My Sample App";
    }

}

export default SampleApp;