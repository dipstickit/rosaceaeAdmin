import {
  Button,
  Card,
  Box,
  Grid,
  Typography,
  useTheme,
  styled,
  Avatar,
  Divider,
  alpha,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { FC, useState } from 'react';
import { Send } from '@mui/icons-material';
import { ChartSeries } from '.';
import { User } from 'src/types/user.type';

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.5)};
  border-radius: 60px;
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

interface AccountBalanceProp {
  chartSeries: ChartSeries[]
  percentage: number[]
  statusLabel: string[]
  monthArr: number[]
  yearArr: number[]
  colorArr: string[]
  accountBalance: number
  month: any
  year: any
  user: User
  setMonth: (data: number) => void
  setYear: (data: number) => void
  fetchAccountBalance: () => void
}

const AccountBalance: FC<AccountBalanceProp> = ({
  chartSeries, percentage, statusLabel,
  monthArr, yearArr, colorArr,
  accountBalance, month, year,
  setMonth, setYear,
  fetchAccountBalance,
  user
}) => {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    colors: colorArr,
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + '%';
      },
      style: {
        colors: [theme.colors.alpha.trueWhite[100]]
      },
      background: {
        enabled: true,
        foreColor: theme.colors.alpha.trueWhite[100],
        padding: 8,
        borderRadius: 4,
        borderWidth: 0,
        opacity: 0.3,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: theme.colors.alpha.black[70],
          opacity: 0.5
        }
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },
    labels: statusLabel.length > 0 && statusLabel !== null ? statusLabel.slice().reverse() : ['1', '2', '3', '4'],
    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[100]
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const renderAllMonth = monthArr.map(i => {
    return (
      <MenuItem key={i} value={i}>{i}</MenuItem>
    )
  })
  const renderYears = yearArr.map(i => {
    return (
      <MenuItem key={i} value={i}>{i}</MenuItem>
    )
  })


  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={5}>
          <Box p={2} py={4} pl={3}>
            <Typography
              sx={{
                pb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              variant="h3"
            >
              {user.role === 'ADMIN' ? 'Price Order all Shop' : 'Account Balance'}
            </Typography>
            <Box sx={{ pb: 2 }} style={{ display: 'flex' }}>
              <Typography
                sx={{
                  mr: 2
                }}
                variant="h3"
              >
                <FormControl fullWidth variant="standard">
                  <InputLabel id="month">Month</InputLabel>
                  <Select label="month"
                    value={month}
                    onChange={e => { setMonth(parseInt(e.target.value)) }}
                  >
                    {renderAllMonth}
                  </Select>
                </FormControl>
              </Typography>
              <Typography
                sx={{
                  mr: 3
                }}
                variant="h3"
              >
                <FormControl fullWidth variant="standard">
                  <InputLabel id="year">Year</InputLabel>
                  <Select label="year"
                    value={year}
                    onChange={e => { setYear(parseInt(e.target.value)) }}
                  >
                    {renderYears}
                  </Select>
                </FormControl>

              </Typography>
              <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button onClick={fetchAccountBalance} size='small' variant="contained" endIcon={<Send />}>
                  View
                </Button>
              </Typography>
            </Box>
            <Box>
              <Typography variant="h1" gutterBottom>
                {accountBalance} ₫
              </Typography>
            </Box>
            {user.role === 'ADMIN' ?
              <>
                <ListItemText
                  sx={{ pb: 1, mt: 3 }}
                  primaryTypographyProps={{ variant: 'h3', gutterBottom: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    lineHeight: 1
                  }}
                  primary={user.role === 'ADMIN' ? 'Revenue' : null}
                  secondary='Revenue = Total revenue from order of all shop x 3%'
                />
                <Box>
                  <Typography variant="h1" gutterBottom>
                    {accountBalance * 3 / 100} ₫
                  </Typography>
                </Box>
              </>
              : null
            }
          </Box>
        </Grid>
        <Grid
          sx={{
            position: 'relative'
          }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={6}
        >
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' }
            }}
          >
            {/* <Divider absolute orientation="vertical" /> */}
          </Box>
          <Box py={4} pr={0} flex={1}>
            <Grid container spacing={0}>
              <Grid
                xs={12}
                sm={5}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Chart
                  height={250}
                  options={chartOptions}
                  series={percentage.slice().reverse()}
                  type="donut"
                />
              </Grid>
              <Grid xs={12} sm={7} pl={2} item display="flex" alignItems="center">
                <List
                  disablePadding
                  sx={{
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <ListItem sx={{
                    paddingTop: '0',
                    paddingLeft: '0'
                  }}>
                    <Box p={1} sx={{
                      paddingTop: '0',
                      paddingLeft: '0'
                    }}>
                      <Typography
                        variant="h3"
                      >
                        Booking Status
                      </Typography>
                    </Box>
                  </ListItem>
                  {
                    chartSeries.length > 0 && chartSeries !== null ? chartSeries.map((i, index) => {
                      return (
                        <ListItem key={i.name} disableGutters
                          style={{
                            background: colorArr.slice().reverse()[index],
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            borderTopRightRadius: index == 0 ? '10px' : '0',
                            borderTopLeftRadius: index == 0 ? '10px' : '0',
                            borderBottomRightRadius: index == chartSeries.length - 1 ? '10px' : '0',
                            borderBottomLeftRadius: index == chartSeries.length - 1 ? '10px' : '0'
                          }}>
                          <ListItemText
                            primary={i.name}
                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                            secondaryTypographyProps={{
                              variant: 'subtitle2',
                              noWrap: true
                            }}
                          />
                          <Box>
                            <Typography align="right" variant="h4" noWrap>
                              {i.value}%
                            </Typography>
                          </Box>
                        </ListItem>)
                    }) : null
                  }
                </List>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;
