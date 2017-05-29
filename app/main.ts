import AppStation from "./app-station";
import config from "./firebase-config";
import SampleApp from "./sample-app";

import "style-loader!./style.css";

new AppStation(config, [
    new SampleApp("sample1", 3, 2),
    new SampleApp("sample2", 2, 2),
    new SampleApp("sample3", 1, 2),
    new SampleApp("sample4", 1, 2),
    new SampleApp("sample5", 2, 1),
    new SampleApp("sample6", 3, 3),
]);