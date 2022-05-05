const path = require('path');

module.exports = (env) => {
    return {
        entry: "./NFTQuery.js",
        mode: "development",
        module: {
            rules: [
                
            ]
        },
        devServer: {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
				"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
			},
			port: env.port
		},
        output: {
			publicPath: "/",
			filename: "bundle.js",
			path: path.resolve(__dirname, "public")
		},
        resolve: {
			extensions: [".js"]
		}
    };
}