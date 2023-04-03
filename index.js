const { Configuration, OpenAIApi } = require("openai");

// index.js
module.exports = (API_KEY) => {
    if(!API_KEY) throw new Error("NO API Key provided");
    const openai = new OpenAIApi(new Configuration({
        apiKey: API_KEY || process.env.OPENAI_API_KEY
    }));

    const genie = async (className, methodName, methodArgs) => {
        try {
            let prompt = `Predict the output of this function call: ${JSON.stringify(className)}.${JSON.stringify(methodName)}(...${JSON.stringify(methodArgs)})\nEnsure the output is parsable using JSON.parse.Example:\n\`\`\`5\`\`\`\n\nOutput:\n\`\`\`json\n`;
            prompt += `\n${methodName} response:\n\`\`\``;
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 50,
                n: 1,
                stop: ["```"],
                temperature: 0.7,
            });
            let result = response.data.choices[0].text.trim();
            if(result.startsWith("json")) result = result.slice(4);
            result = result.trim();
            result = JSON.parse(result);
            return result;
        } catch (err) { return false; }
    }

    return new Proxy({}, {
        get: function (target, prop) {
            if (!target[prop]) {
                const methodsProxy = new Proxy({}, {
                    get: (target, methodName) => {
                        return async (...args) => {
                            // Implement your logic here
                            return await genie(prop, methodName, args);
                        };
                    }
                });

                target[prop] = methodsProxy;
            }
            return target[prop];
        },
    });
}
