module.exports = {
  presets: [
    [
      'next/babel'
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'inline-react-svg',
  ],
}
