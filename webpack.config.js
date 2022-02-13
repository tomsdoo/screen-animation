const path = require("path");
const {VueLoaderPlugin} = require("vue-loader");

module.exports = {
  // devtool: "inline-source-map",
  // mode: "development",
  mode:"production",
  plugins:[
    new VueLoaderPlugin()
  ],
  module:{
    rules:[
      {
        test:/\.css$/,
        use:["style-loader","css-loader"]
      },
      {
        test:/\.vue$/,
        use:["vue-loader"]
      },
      {
        test:/\.s[ac]ss$/,
        use:["style-loader","css-loader","sass-loader"]
      },
      {
        test:/\.ts$/,
        loader:"ts-loader",
        options: {
          transpileOnly: true,
          configFile: path.join(__dirname, "tsconfig.json"),
          appendTsSuffixTo: [/\.vue$/]
        }
      }
    ]
  },
  resolve:{
    extensions:[".ts",".js",".vue"],
    modules:["node_modules"],
    alias:{
      vue:"vue/dist/vue.common.js"
    }
  },
  entry:{
    "screen-animation": "./src/index_js/use-index.ts",
    "screen-animation-avalanche": "./src/avalanche_js/use-index.ts"
  },
  output:{
    path:path.join(__dirname, "dist/js"),
    filename:"[name].js"
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
};
