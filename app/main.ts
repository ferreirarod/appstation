import AppStation from "./app-station";
import config from "./firebase-config";
import SampleApp from "./sample-app";

import "style-loader!./style.css";

new AppStation(config, [
    new SampleApp("sample1", 4, 3),
    new SampleApp("sample2", 3, 3),
    new SampleApp("sample3", 2, 3),
    new SampleApp("sample4", 2, 3),
    new SampleApp("sample5", 3, 2),
    new SampleApp("sample6", 4, 4),
]);