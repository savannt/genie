const { Geo } = require("./index.js")("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");

// For reproducibility, we can create an instance of something with the first parameter being it's UUID (blank for random)
(async () => {
    console.log(await Geo.info("New York City"));
})();