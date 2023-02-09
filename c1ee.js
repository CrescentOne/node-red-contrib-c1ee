module.exports = (RED) => {
    // imports
    const path = require("path")
    const fs = require("fs");

    // node
    function c1ee(config) {
        RED.nodes.createNode(this, config);

        this.name = config.name;
        this.ext = config.ext;

        let node = this;
        node.on('input', (msg) => {
            // initialize
            msg.payload = msg.payload ?? {};
            msg.payload.error = {};
            msg.debug = {expected_ext: node.ext};

            // #1 Error, #2 Correct
            if (!msg.path) {
                msg.payload.error = { error: 'No path.' };
                node.send([msg, null]);
                return;
            }
            // save debug info
            msg.debug.path = msg.path;

            // get file data
            const file = fs.readFileSync(msg.path);
            const extension = path.extname(msg.path);

            // save debug info
            msg.debug.file = file.toString();
            msg.debug.extension = extension;

            if (extension != node.ext) {
                msg.payload.error = { error: 'Invalid extension.' };
                node.send([msg, null]);
                return;
            }

            if (file.toString() != 'Execute Easter Egg') {
                msg.payload.error = { error: 'Invalid content.' };
                node.send([msg, null]);
                return;
            }

            node.send([null, msg])
        });
    }
    RED.nodes.registerType("c1ee", c1ee);
}
