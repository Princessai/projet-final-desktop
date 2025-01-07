import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';

function PieOrDoughnutChart({
    data,
    dataLabel,
    datasetsLabel,
    datasetsData,
    datasetsBgColor,
    chartTitle,
    legendPosition,
    datalabels,
    canvaHeigth = 250,
    canvaWidth = 50

}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");

        // Enregistrer le plugin pour toutes les cartes :
        Chart.register(ChartDataLabels, annotationPlugin);

        console.log("🚀 ~ useEffect ~ datasetsData:", datasetsData, datasetsLabel)
        const myPieChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: dataLabel,
                datasets: [
                    {
                        label: datasetsLabel ? datasetsLabel : '',
                        data: datasetsData,
                        backgroundColor: datasetsBgColor ? datasetsBgColor : datasetsData.map((value) => {
                            if (value >= 70) return '#00B050';
                            if (value >= 50.1) return '#92D050';
                            if (value >= 30.1) return '#FFC000';
                            return '#E30F41';
                        }),
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: legendPosition },
                    title: { display: true, text: chartTitle }, //titre du graphique
                    datalabels: {
                        color: "black", // Text color
                        anchor: "end", // Position the text at the end of the bar
                        align: "end", // Align text horizontally inside the bar
                        font: { weight: "bold", size: 10 }, // Font styling
                    },
                    annotation: {
                        annotations: {
                            dLabel: {
                                type: 'doughnutLabel',
                                content: ({ chart }) => ['Attendance mark',
                                    data.attendanceMark,

                                ],
                                font: [{ size: 40 }, { size: 70 }],
                                color: ['grey', 'red']
                            }
                        }
                    }
                },

            },
        });


        return () => {
            myPieChart.destroy();
        };
    }, []);


    return (
        <div style={{ position: "relative", height: `${canvaHeigth}px`, width: `${canvaWidth}%`, minWidth: '100px' }}>
            <canvas ref={canvasRef}></canvas>

        </div>
    )
}

export default PieOrDoughnutChart