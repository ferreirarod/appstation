import App from "./app";

class SampleApp extends App {

    constructor(id: string, width: number, height: number) {
        super(id, id, "Sample App to test if this whole idea works", false, width, height);
    }

    protected getInnerHTML(): string {
        return this.getId();
    }

}

export default SampleApp;