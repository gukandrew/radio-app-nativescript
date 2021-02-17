import Vue from "nativescript-vue";

Vue.registerElement('VideoPlayer', () => require('nativescript-videoplayer').Video)

import App from "./components/App";

new Vue({
    render: h => h(App)
}).$start();
