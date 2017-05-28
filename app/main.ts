import AppStation from "./app-station";
import config from "./firebase-config";
import SampleApp from "./sample-app";

import "style-loader!./style.css";

new AppStation(config, [
    new SampleApp()
]);