import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useMatchBreakpoints } from '@sphynxdex/uikit'
import styled from 'styled-components'

const ChartWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: ${({ isMobile }) => (isMobile ? '0px' : '-20px')};
  .chart-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    align-items: center;
    font-size: ${({ isMobile }) => (isMobile ? '15px' : '20px')};
    .header-card {
      display: flex;
      justify-content: center;
      align-items: center;
      height: ${({ isMobile }) => (isMobile ? '30px' : '40px')};
      border-radius: 3px;
      border: #aaa 1px solid;
      margin-right: 20px;
      padding: 0 10px;
    }
  }
  .chart-content {
    display: flex;
    flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
    justify-content: center;
    align-items: center;
    width: 100%;
    .doughnut {
      padding: 10px;
      width: fit-content;
    }
    .chart-label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: fit-content;
      padding: 10px;
      .distribute-label {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 5px;
        .distribute-name {
          text-align: left;
          font-size: 13px;
        }
      }
    }
  }
`

const LabelColor = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  height: 20px;
  width: 20px;
  min-width: 20px;
  border: 1px #aaa solid;
  border-radius: 3px;
  margin-right: 20px;
`

const chartColors = ['#0066cc', '#4cb140', '#009596', '#f4c145', '#ec7a08']

const distributeLabel = ['Burn', 'SphynxLock', 'Presale', 'Liquidity', 'Unlocked']

interface ChartProps {
  symbol?: string;
  distributeData?: Array<any>;
}

const DistributeChart: React.FC<ChartProps> = ({ symbol, distributeData }) => {
 const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const data = {
    labels: distributeLabel,
    datasets: [
      {
        data: distributeData,
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors,
      },
    ],
  }

  const options: any = {
    legend: {
      display: false,
      position: 'right',
    },
    responsive: false,
    maintainAspectRatio: true,
    elements: {
      arc: {
        borderWidth: 0,
      },
      center: {
        text: symbol
      }
    },
    cutoutPercentage: 80,
  }

  // useEffect(() => {
  //   const legend = chartInstance.chartInstance.generateLegend();
  //   console.log(chartInstance, "textinput");
  //   console.log(legend);
  //   document.getElementById("legend").innerHTML = legend;
  // }, [chartInstance]);
  const plugins: any = [
    {
      beforeDraw: (chart) => {
        const width = chart.width
        const height = chart.height
        const ctx = chart.ctx
        ctx.restore()
        const fontSize = Number((height / 100).toFixed(2))
        ctx.font = `30px sans-serif`
        ctx.fillStyle = '#fff'
        ctx.textBaseline = 'top'
        let text = chart.config.options.elements.center.text
        let textX = Math.round((width - ctx.measureText(text).width) / 2)
        let textY = height / 2 - 16 * fontSize
        ctx.fillText(text, textX, textY)

        ctx.font = `20px sans-serif`
        ctx.textBaseline = 'top'
        text = 'Distribution'
        textX = Math.round((width - ctx.measureText(text).width) / 2)
        textY = height / 2
        ctx.fillStyle = '#fff'
        ctx.fillText(text, textX, textY)

        ctx.save()
      },
    },
  ]

  const renderLegend = () => {
    const labels = distributeLabel.map((label, index) => (
      <div className="distribute-label" key={label}>
        <LabelColor color={chartColors[index]} />
        <div className="distribute-name">{`${distributeLabel[index]} ${distributeData[index]}%`}</div>
      </div>
    ))
    return labels
  }

  return (
    <ChartWrapper isMobile={isMobile}>
      <div className="chart-header">
        <div className="header-card">Sphynx</div>
        <div className="header-str">DYOR Area</div>
      </div>
      <div className="chart-content">
        <div className="doughnut">
          <Doughnut
            data={data}
            width={isMobile ? 151 : 201}
            height={isMobile ? 151 : 201}
            options={options}
            plugins={plugins}
          />
        </div>
        <div className="chart-label">{renderLegend()}</div>
      </div>
    </ChartWrapper>
  )
}

export default DistributeChart
