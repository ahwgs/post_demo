import React, { PureComponent, createRef } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { WebView as RNWebView } from 'react-native-webview';
import renderChart, { changeChartData } from './renderChart';

const source = Platform.select({
  // eslint-disable-next-line global-require
  ios: require('./f2chart.html'),
  android: { uri: 'file:///android_asset/f2chart.html' },
});

export default class Chart extends PureComponent {
  static defaultProps = {
    onChange: () => {},
    initScript: '',
    data: [],
    webView: RNWebView,
  };

  constructor(props) {
    super(props);
    this.chart = createRef();
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (data !== nextProps.data) {
      this.reload();
      this.chart.current.injectJavaScript(changeChartData(nextProps));
    }
  }

  update = data => {};

  onMessage = event => {
    const {
      nativeEvent: { data },
    } = event;
    const { onChange } = this.props;
    const tooltip = JSON.parse(data);
    onChange(tooltip);
  };

  reload = () => {
    this.chart.current.reload();
  };

  onLoadEnd = () => {
    setTimeout(() => {
      this.chart.current.injectJavaScript(renderChart(this.props));
    }, 10);
  };

  render() {
    const { data, ...props } = this.props;
    return (
      <RNWebView
        scrollEnabled={false}
        javaScriptEnabled
        ref={this.chart}
        style={styles.webView}
        injectedJavaScript={renderChart(this.props)}
        source={source}
        onLoadEnd={this.onLoadEnd}
        originWhitelist={['*']}
        onMessage={this.onMessage}
        {...props}
      />
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
