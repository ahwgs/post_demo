import { formatChartDate, getLastThreeM } from '@/utils/Tools/date';
// 从数组中获取最大的值
const getMaxValue = list => {
  const nums = list.map(v => v.value);
  return Math.max.apply(null, nums);
};

const getNumScale = maxV => {
  let ticks = [];
  const nums = [100, 1000, 10000, 100000, 1000000, 10000000];
  if (maxV >= 0 && maxV <= 100) {
    ticks = [0, 25, 50, 75, 100];
  } else {
    for (let i = 0; i <= nums.length; i++) {
      if (maxV > nums[i] && maxV <= nums[i + 1]) {
        const max = parseInt(maxV / nums[i], 10);
        const scan = ((max + 1) / 4) * nums[i];
        for (let j = 0; j <= 4; j++) {
          ticks.push(j * scan);
        }
      }
    }
  }
  return ticks;
};

const defaultChartData = () => {
  const times = getLastThreeM();
  return times.map(time => {
    return {
      date: time,
      value: 0,
    };
  });
};

export const changeChartData = props => {
  const { data = [] } = props;
  const chartData =
    data.length > 0
      ? data.map(c => {
          return {
            ...c,
            date: formatChartDate(c.date),
          };
        })
      : defaultChartData();
  return `chart && chart.changeData(${JSON.stringify(chartData)})`;
};

/**
①当3个月内收入最高的那个月收入在100元以内时，5级分别为：0.00元、25.00元、50.00元、75.00元、100.00元；
②当3个月内收入最高的那个月收入高于100元，且最高位数为百位数时，纵坐标间隔数=【（最高收入百位数+1）/4】*100。如最高月收入是399.9，则纵坐标间隔数=【（3+1）/4】*100=100，纵坐标5级为0.00元、100.00元、200.00元、300.00元、400.00元；
③当3个月内收入最高的那个月收入最高位数为千位数时，，纵坐标间隔数=【（最高收入千位数+1）/4】*1000。如最高月收入是3999.9，则纵坐标间隔数=【（3+1）/4】*1000=1000，纵坐标5级为0.00元、1000.00元、2000.00元、3000.00元、4000.00元
④以此类推
注意：数字超过999用单位K延伸数字
 */
export default function renderChart(props) {
  const { data = [] } = props;
  const chartData =
    data.length > 0
      ? data.map(c => {
          return {
            ...c,
            date: formatChartDate(c.date),
          };
        })
      : defaultChartData();

  const lastData = chartData[chartData.length - 1];

  const maxV = getMaxValue(chartData);
  const ticks = getNumScale(maxV) || [0, 25, 50, 75, 100];
  const script = `
  (function(){
    const chart = new F2.Chart({
      id: 'chart',
      pixelRatio: window.devicePixelRatio,
      padding: 'auto',
    });
    chart.source(${JSON.stringify(chartData)}, {
      value: {
        tickCount: 5,
        min: 0,
        ticks: ${JSON.stringify(ticks)},
        sortable:false
      },
      date: {
        type: 'timeCat',
        range: [0, 1],
        tickCount: 3,
      }
    });
    chart.tooltip({
      showCrosshairs:true,
      crosshairsStyle: {
        lineDash: [2]
      },
      alwaysShow:true,
      showItemMarker: false,
      background: {
        radius: 2,
        fill: 'rgb(229,35,97)',
        padding: [ 2, 6 ]
      },
      tooltipMarkerStyle: {
        fill: '#5B98FF', // 设置 tooltipMarker 的样式
        radius: 4,
        lineWidth: 2,
        stroke: '#d9e5fc',
      },
      onShow: function(ev) {
        const items = ev.items;
        const value = items[0].value;
        items[0].name = null;
        items[0].value = value>0?'+'+value + '元' : '0.00';
      }
    });
    chart.axis('value', {
      label: function label(text, index, total) {
        const nFormatter = (num, digits) => {
          if(num >= 10000) {
            num = Math.round(num/1000)/10 + 'W';
          } else {
            num = Math.round(num/100)/10 + 'K';
         }
            return num;
         };
        const formatText = function(text){
          const isLarge = ${maxV > 999}
          if(isLarge){
            return nFormatter(text,2)
          }
          if(!isLarge && text<=999) return text.toFixed(2)
        }
        const textCfg = {
          text:formatText(parseInt(text,10))
        };
        return textCfg;
      }
    }); 
    chart.axis('date', {
      label: function label(text, index, total) {
        const textArr = text.split('-');
        const month = textArr[1];
        const textCfg = {
          color:'#888B9C',
          fontSize:'10',
          text:textArr[0]+'年'+parseInt(month)+'月'
        };
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.line({
      sortable: false
    }).position('date*value').shape('smooth')
    chart.area({
      sortable: false
    }).position('date*value').shape('smooth')
    chart.render();

    const item = ${JSON.stringify(lastData)}
    const point = chart.getPosition(item); 
    chart.showTooltip(point); 
  })();
  `;
  return script;
}
