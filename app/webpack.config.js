const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      title: 'OLVoteSys',

    }),
    new HtmlWebpackPlugin({
      filename: 'register.html',
      template: 'src/register.html',
      title: 'Register',
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: 'src/login.html',
      title: 'Login',
    }),
    new HtmlWebpackPlugin({
      filename: 'voterDash.html',
      template: 'src/voterDash.html',
      title: 'VoterDashboard',
    }),
    new HtmlWebpackPlugin({
      filename: 'adminDash.html',
      template: 'src/adminDash.html',
      title: 'AdminDashPage',
    }),
    new HtmlWebpackPlugin({
      filename: 'adminRegister.html',
      template: 'src/adminRegister.html',
      title: 'AdminRegister',
    }),
    new HtmlWebpackPlugin({
      filename: 'voterVote.html',
      template: 'src/voterVote.html',
      title: 'VoterVotePage',
    }),
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),

  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
