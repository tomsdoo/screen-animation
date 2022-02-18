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
    "screen-animation-avalanche": "./src/avalanche_js/use-index.ts",
    "screen-animation-life": "./src/life_js/use-index.ts",
    "screen-animation-line": "./src/line_js/use-index.ts",
    "screen-animation-message": "./src/message_js/use-index.ts",
    "screen-animation-puzzle": "./src/puzzle_js/use-index.ts",
    "screen-animation-rails": "./src/rails_js/use-index.ts",
    "screen-animation-sea": "./src/sea_js/use-index.ts",
    "screen-animation-sky": "./src/sky_js/use-index.ts",
    "screen-animation-space": "./src/space_js/use-index.ts",
    "screen-animation-sparkler": "./src/sparkler_js/use-index.ts",
    "screen-animation-star": "./src/star_js/use-index.ts"
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
