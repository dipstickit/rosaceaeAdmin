import { FC, MouseEvent, useEffect, useState } from 'react';
import {
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  Typography,
  styled,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import ViewWeekTwoToneIcon from '@mui/icons-material/ViewWeekTwoTone';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import WatchListColumn from './WatchListColumn';
import WatchListRow from './WatchListRow';
import { Send } from '@mui/icons-material';


const EmptyResultsWrapper = styled('img')(
  ({ theme }) => `
      max-width: 100%;
      width: ${theme.spacing(66)};
      height: ${theme.spacing(34)};
`
);

interface WatchListProp {
  monthArr: number[]
  yearArr: number[]
  accountBalance: number
  month: any
  year: any
  dayList: string[]
  revenueList: number[]
  orderList: number[]
  completedBookingList: number[]
  completedBookingRevenueList: number[]
  today: Date
  totalOrder: number
  totalCompletedBooking: number
  setMonth: (data: number) => void
  setYear: (data: number) => void
  fetchAccountBalance: () => void
  fetchChart: () => void
}

export interface WatchListColumnProp {
  dayList: string[]
  revenueList: number[]
  orderList: number[]
  completedBookingList: number[]
  completedBookingRevenueList: number[]
  month: number
  year: number
  revenueMonthly: number
  totalOrder: number
  totalCompletedBooking: number
}

export interface WatchListRowProp {
  dayList: string[]
  revenueList: number[]
  orderList: number[]
  month: number
  year: number
  revenueMonthly: number
  totalOrder: number
}

const WatchList: FC<WatchListProp> = ({
  monthArr, yearArr, accountBalance, month, year, dayList, revenueList,
  setMonth, setYear, fetchChart, today, totalOrder,
  orderList, completedBookingList, completedBookingRevenueList, totalCompletedBooking
}) => {
  const [tabs, setTab] = useState<string | null>('watch_list_columns');
  console.log(totalOrder)
  const handleViewOrientation = (
    _event: MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    setTab(newValue);
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
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3
        }}
      >
        <Typography variant="h3">
          Revenue and Order
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
              <Button onClick={fetchChart} size='small' variant="contained" endIcon={<Send />}>
                View
              </Button>
            </Typography>
          </Box>
        </Typography>
        <ToggleButtonGroup
          value={tabs}
          exclusive
          onChange={handleViewOrientation}
        >
          <ToggleButton disableRipple value="watch_list_columns">
            <ViewWeekTwoToneIcon />
          </ToggleButton>
          <ToggleButton disableRipple value="watch_list_rows">
            <TableRowsTwoToneIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {tabs === 'watch_list_columns' && <WatchListColumn
        dayList={dayList}
        revenueList={revenueList}
        month={today.getMonth() + 1}
        year={today.getFullYear()}
        revenueMonthly={accountBalance}
        orderList={orderList}
        completedBookingList={completedBookingList}
        completedBookingRevenueList={completedBookingRevenueList}
        totalOrder={totalOrder}
        totalCompletedBooking={totalCompletedBooking}
      />}

      {tabs === 'watch_list_rows' && <WatchListRow
        dayList={dayList}
        revenueList={revenueList}
        month={today.getMonth() + 1}
        year={today.getFullYear()}
        revenueMonthly={accountBalance}
        orderList={orderList}
        totalOrder={totalOrder}
      />}

      {!tabs && (
        <Card
          sx={{
            textAlign: 'center',
            p: 3
          }}
        >
          <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

          <Typography
            align="center"
            variant="h2"
            fontWeight="normal"
            color="text.secondary"
            sx={{
              mt: 3
            }}
            gutterBottom
          >
            Click something, anything!
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 4
            }}
          >
            Maybe, a button?
          </Button>
        </Card>
      )}
    </>
  );
}

export default WatchList;
