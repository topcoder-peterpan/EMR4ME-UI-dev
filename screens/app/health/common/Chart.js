import React from 'react';
import { ScrollView, Alert } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { theme } from '../../../../constants';

export default (props) => {
    const { data, width, height, decimalPlaces, formatYLabel, barPercentage } = props;
    const config = {
        formatYLabel: formatYLabel ? (val) => parseInt(val) : null,
        backgroundColor: "#FFFFFF",
        backgroundGradientFrom: "#FFFFFF",
        backgroundGradientTo: "#FFFFFF",
        decimalPlaces: decimalPlaces || 2,
        barPercentage: barPercentage || null,
        color: (opacity = 1) => theme.colors.primary,
        labelColor: () =>
           theme.colors.secondary,
        propsForDots: {
            r: "10",
            strokeWidth: "0",
            stroke: "#808080",
        },
        barPercentage: 1,
        propsForLabels: {
            fontSize: '14',
            fontWeight: 'bold'
        }
    }

    const isMoreThanOneLine = data.datasets.length > 1;

    const chartData = {
        labels: data.labels,
        datasets: data.datasets,
    };

    const showSelectedValue = (e) => {
        if (e.index !== undefined && data.labels) {
            if (data.labels[e.index]){
                let value = String(e.value);
                if(isMoreThanOneLine)
                    value = data.datasets[1].data[e.index] + '/' + data.datasets[0].data[e.index];
                Alert.alert(data.labels[e.index], value + " " + (e.dataset.units[e.index] ? e.dataset.units[e.index] : ''))
            }
        }
    }

    if(isMoreThanOneLine)
    data.datasets[0].color = () => theme.colors.error;

    let wrapper = barPercentage ?
        (<BarChart
            data={chartData}
            width={width}
            height={height}
            verticalLabelRotation={-65}
            horizontalLabelRotation={- 45}
            xLabelsOffset={20}
            chartConfig={config}
            showBarTops={true}
            fromZero={true}
            bar
        />) :
        (<LineChart
            data={chartData}
            width={width}
            height={height}
            verticalLabelRotation={-65}
            horizontalLabelRotation={- 45}
            xLabelsOffset={20}
            chartConfig={config}
            bezier
            fromZero={true}
            onDataPointClick={(e) => showSelectedValue(e)}
            withShadow={!isMoreThanOneLine}
            withInnerLines={!isMoreThanOneLine}
             withVerticalLines={false}
        />);

    return (
        <>
            {width === 1 ? null : (
                <ScrollView horizontal={true}>
                    {wrapper}
                </ScrollView>
            )}
        </>
    )
}