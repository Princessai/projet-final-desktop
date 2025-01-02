import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

function BarChart({
    dataLabel,
    datasetsLabel,
    datasetsData,
    datasets,
    datasetsBgColor,
    axisDirection = 'y',
    chartTitle,
    legendPosition,
    isStacked = false,
    datalabels,
    canvaHeigth = 300,
    canvaWidth = 100
}) {



    const canvasRef = useRef(null);

    let scales = {
        y:
            { beginAtZero: true }
    }

    if (isStacked) {
        scales = {
            x: {
                beginAtZero: true,
                stacked: true,

            },
            y: {
                beginAtZero: true,
                stacked: true,

            },

        }
    }

    const myBarChart = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");

        // Enregistrer le plugin pour toutes les cartes :
        Chart.register(ChartDataLabels);


        myBarChart.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: dataLabel,
                datasets: datasets ? datasets : [
                    {
                        label: datasetsLabel,
                        data: datasetsData,
                        backgroundColor: datasetsBgColor,
                    },

                ],
            },
            options: {
                indexAxis: axisDirection, // orientation des bar (y:horizontal et x:vertical)
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: legendPosition },
                    title: { display: true, text: chartTitle }, //titre du graphique
                    datalabels: {
                        color: "black", // Text color
                        anchor: "center", // Position the text at the end of the bar
                        align: "start", // Align text horizontally inside the bar
                        textAlign: 'center',
                        font: { size: 12 }, // Font styling
                        clamp: true,
                        display: function (context) {
                            // Check if the value is 0
                            return context.dataset.data[context.dataIndex] !== 0;
                        },
                    },
                },

                scales: scales,
            },
        });


        return () => {
            myBarChart.current.destroy();
        };
    }, []);

    useEffect(() => {
        console.log('myBarChart', myBarChart.current);

        console.log("🚀 ~ useEffect ~ datasetsData:", datasetsData)

        if (dataLabel.length !== 0) {
            myBarChart.current.config.data.labels = dataLabel;
        }
        if (datasetsData && datasetsData.length !== 0) {
            myBarChart.current.config.data.datasets[0].data = datasetsData;
        }
        if (chartTitle.length !== 0) {
            myBarChart.current.config.options.plugins.title.text = chartTitle;

        }

        myBarChart.current.update();

    }, [dataLabel, datasetsData, chartTitle]);

    useEffect(()=>{
        if (datasets){
            myBarChart.current.config.data.datasets = datasets; 
            myBarChart.current.update();

        }
    },[datasets])

    return (
        <div style={{ position: "relative", height: `${canvaHeigth}px`, width: `${canvaWidth}%` }}>
            <canvas ref={canvasRef}></canvas>

        </div>

    )
}

export default BarChart