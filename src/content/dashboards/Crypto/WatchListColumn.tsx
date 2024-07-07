import {
  Card,
  Box,
  Typography,
  Avatar,
  Grid,
  alpha,
  useTheme,
  styled
} from '@mui/material';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { FC } from 'react';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(0, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${theme.palette.mode === 'dark'
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

interface WatchListProp {
  dayList: string[]
  revenueList: number[]
  orderList: number[]
  month: number
  year: number
  revenueMonthly: number
  totalOrder: number
}

const WatchListColumn: FC<WatchListProp> = ({ dayList, revenueList,
  orderList, totalOrder,
  month, revenueMonthly }) => {
  const theme = useTheme();
  console.log(orderList)

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    fill: {
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    colors: [theme.colors.primary.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      colors: [theme.colors.primary.main],
      width: 3
    },
    legend: {
      show: false
    },
    labels: dayList,
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false,
      tickAmount: 5
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        title: {
          formatter: function () {
            return 'Revenue: ₫';
          }
        }
      },
      marker: {
        show: false
      }
    }
  };
  const chartOptions2: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    fill: {
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    colors: [theme.colors.primary.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      colors: [theme.colors.primary.main],
      width: 3
    },
    legend: {
      show: false
    },
    labels: dayList,
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false,
      tickAmount: 5
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        title: {
          formatter: function () {
            return 'Number of order: ';
          }
        }
      },
      marker: {
        show: false
      }
    }
  };
  const chart1Data = [
    {
      name: `Daily Revenue In Month: ${month}`,
      data: revenueList
    }
  ];
  const chart2Data = [
    {
      name: 'Ethereum Price',
      data: orderList
    }
  ];
  const chart3Data = [
    {
      name: 'Cardano Price',
      data: [51.85, 41.77, 22.09, 42.0, 71.9, 51.84, 31.84]
    }
  ];

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={3}
    >
      <Grid item md={4} xs={12}>
        <Card
          sx={{
            overflow: 'visible'
          }}
        >
          <Box
            sx={{
              p: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <Box>
                <Typography variant="h4" noWrap>
                  {`Daily Revenue In Month ${month}:`}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 3
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1
                }}
              >
                {revenueMonthly} ₫
              </Typography>
            </Box>
          </Box>
          <Chart
            options={chartOptions}
            series={chart1Data}
            type="area"
            height={200}
          />
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card
          sx={{
            overflow: 'visible'
          }}
        >
          <Box
            sx={{
              p: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <Box>
                <Typography variant="h4" noWrap>
                  {`Daily Number Of Order In Month ${month}:`}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 3
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1
                }}
              >
                {totalOrder}
              </Typography>
            </Box>
          </Box>
          <Chart
            options={chartOptions2}
            series={chart2Data}
            type="area"
            height={200}
          />
        </Card>
      </Grid>
      {/* <Grid item md={4} xs={12}>
        <Card
          sx={{
            overflow: 'visible'
          }}
        >
          <Box
            sx={{
              p: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper>
                <img
                  alt="ADA"
                  src="/static/images/placeholders/logo/cardano.png"
                />
              </AvatarWrapper>
              <Box>
                <Typography variant="h4" noWrap>
                  Cardano
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  ADA
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 3
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1
                }}
              >
                $23.00
              </Typography>
              <Text color="error">
                <b>-0.33%</b>
              </Text>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              <Label color="error">-$5</Label>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  pl: 1
                }}
              >
                last 24h
              </Typography>
            </Box>
          </Box>
          <Chart
            options={chartOptions}
            series={chart3Data}
            type="area"
            height={200}
          />
        </Card>
      </Grid> */}
    </Grid>
  );
}

export default WatchListColumn;
