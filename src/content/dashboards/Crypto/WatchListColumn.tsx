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
import { WatchListColumnProp } from './WatchList';
import numeral from 'numeral';

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

const WatchListColumn: FC<WatchListColumnProp> = ({ dayList, revenueList,
  orderList, totalOrder, totalCompletedBooking, revenueBooking, user,
  month, revenueMonthly, completedBookingList, completedBookingRevenueList
}) => {
  const theme = useTheme();
  console.log(orderList)
  const maxNumberOfOrder = orderList !== undefined ? Math.max(...orderList) : 0
  const maxNumberOfCompletedBooking = completedBookingList !== undefined ? Math.max(...completedBookingList) : 0
  console.log(maxNumberOfOrder)

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
        formatter(value, { dataPointIndex, w }) {
          return w.config.series[0].data[dataPointIndex] + ' ₫'
        },
        // title: {
        //   formatter: function (value) {
        //     return `Revenue: ${value} ₫`;
        //   }
        // }
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
      min: 0,
      max: maxNumberOfOrder + 0.0785,
      show: false,
      tickAmount: 2,
      labels: {
        formatter: (value: number) => value.toFixed(0)  // Formatting to handle small numbers
      }
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        formatter(value, { dataPointIndex, w }) {
          return w.config.series[0].data[dataPointIndex]
        },
        // title: {
        //   formatter: function () {
        //     return 'Number of order: ';
        //   }
        // }
      },
      marker: {
        show: false
      }
    }
  };
  const chartOptions3: ApexOptions = {
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
      tickAmount: 2,
      labels: {
        formatter: (value: number) => value.toFixed(0)  // Formatting to handle small numbers
      }
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        formatter(value, { dataPointIndex, w }) {
          return w.config.series[0].data[dataPointIndex] + ' ₫'
        },
        // title: {
        //   formatter: function () {
        //     return 'Number of order: ';
        //   }
        // }
      },
      marker: {
        show: false
      }
    }
  };
  const chartOptions4: ApexOptions = {
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
      min: 0,
      max: maxNumberOfCompletedBooking + 0.0785,
      show: false,
      tickAmount: 2,
      labels: {
        formatter: (value: number) => value.toFixed(0)  // Formatting to handle small numbers
      }
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        formatter(value, { dataPointIndex, w }) {
          return w.config.series[0].data[dataPointIndex]
        },
        // title: {
        //   formatter: function () {
        //     return 'Number of order: ';
        //   }
        // }
      },
      marker: {
        show: false
      }
    }
  };
  const chart1Data = [
    {
      name: `Revenue`,
      data: revenueList,
    }
  ];
  const chart2Data = [
    {
      name: `Number of order: `,
      data: orderList
    }
  ];
  const chart3Data = [
    {
      name: 'Booking Revenue',
      data: completedBookingRevenueList
    }
  ];
  const chart4Data = [
    {
      name: 'Number Of Completed Booking',
      data: completedBookingList
    }
  ];

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
        marginBottom={3}
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
                    {`Daily Revenue:`}
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
                  {user.role === 'ADMIN' ? numeral(revenueMonthly * 3 / 100).format('0,0') : numeral(revenueMonthly).format('0,0')} ₫
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
                    {`Daily Number Of Order:`}
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
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignContent='space-between'
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
                    {`Completed Booking:`}
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
                  {numeral(revenueBooking).format('0,0')} ₫
                </Typography>
              </Box>
            </Box>
            <Chart
              options={chartOptions3}
              series={chart3Data}
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
                    {`Number Of Completed Booking:`}
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
                  {totalCompletedBooking}
                </Typography>
              </Box>
            </Box>
            <Chart
              options={chartOptions4}
              series={chart4Data}
              type="area"
              height={200}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default WatchListColumn;
