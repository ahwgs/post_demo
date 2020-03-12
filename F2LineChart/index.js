import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Chart from './charts';

class F2LineChart extends PureComponent {
  render() {
    const { chartData } = this.props;
    return (
      <View style={{ height: 200 }}>
        <Chart data={chartData} />
      </View>
    );
  }
}

export default F2LineChart;
