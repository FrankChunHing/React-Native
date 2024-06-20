import { VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';
const Chart = ({chartData, loading}) => {
    if (loading) {
        return (
            <View style={styles.main}>
            <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
        }
    return (
    <VictoryChart
    width={500}
    height={300}
    theme={VictoryTheme.material}>
        <VictoryLine
            style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc"}
            }}
            data={chartData}
        />
    </VictoryChart>
    )
}

export default Chart
