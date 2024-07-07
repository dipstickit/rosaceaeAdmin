import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';

import AccountBalance from './AccountBalance';
import WatchList from './WatchList';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OrderDetailService, { DailyOrderCountResponse, DailyPriceForShopResponse } from 'src/api/OrderDetail.service';
import { setUser } from 'src/redux/slices/auth.slice';
import { useAppDispatch } from 'src/redux/store';
import jwt_decode from "jwt-decode";
import UserService from '../../../api/User.services';
import BookingService from 'src/api/Booking.service';

export interface ChartSeries {
  name: string;
  value: number;
}

function DashboardCrypto() {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const today = new Date()
  const colorArr = ['#b2b5b2', '#8291ff', '#57ca22', '#e74c3c']
  const [chartSeries, setChartSeries] = useState<ChartSeries[]>([]);
  const [percentage, setPercentage] = useState<number[]>([])
  const [statusLabel, setStatusLabel] = useState<string[]>([])
  const [revenueDayList, setRevenueDayList] = useState<DailyPriceForShopResponse[]>()
  const [dayList, setDayList] = useState<string[]>()
  const [revenue, setRevenue] = useState<number[]>()
  const [orderList, setOrderList] = useState<number[]>()
  const [accountBalance, setAccountBalance] = useState<number>(0)
  const [monthArr, setMonthArr] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  const [yearArr, setYearArr] = useState<number[]>(Array.from({ length: today.getFullYear() - 2000 + 1 }, (_, i) => today.getFullYear() - i).slice().reverse());
  const [month, setMonth] = useState<any>((today.getMonth() + 1))
  const [year, setYear] = useState<any>(today.getFullYear())
  const [totalOrder, setTotalOrder] = useState<number>(0)
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  let [userInfo, setUserInfo] = useState<any>(useSelector((state: any) => state.auth.userInfo))

  const getUserByEmail = async () => {
    var decoded = jwt_decode(accessToken);
    console.log(decoded)
    const response = await UserService.getUserByEmail(decoded["sub"], accessToken)
    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('userToken');
      navigate('/login')
      return
    }
    setUserInfo(response.data['userInfo'])
    console.log(userInfo)
    dispatch(setUser(userInfo));
  }

  if (userInfo === null) {
    console.log("user is null")
    getUserByEmail()
  }
  const fetchData = async () => {
    try {
      let response = null
      let response_1 = null
      let response_2 = null
      let response_3 = null
      response = await OrderDetailService.getRevenueEachDay(userInfo.usersID, today.getMonth() + 1, today.getFullYear(), accessToken);
      response_1 = await OrderDetailService.getTotalPrice(userInfo.usersID, today.getMonth() + 1, today.getFullYear(), accessToken);
      response_2 = await BookingService.getOrderStatusPercentage(userInfo.usersID, accessToken);
      response_3 = await OrderDetailService.getOrderEachDay(userInfo.usersID, today.getMonth() + 1, today.getFullYear(), accessToken)
      console.log('Response data:', response.data);
      console.log('Response_1 data:', response_1.data);
      console.log('Response_2 data:', response_2.data);
      console.log('Response_3 data:', response_3.data);
      const transformedData: any = Object.entries(response_2.data).map(([name, value]) => ({
        name,
        value,
      }));
      const dayList = response.data.map((item: DailyPriceForShopResponse) => `Day ${item.day.toString()}`)
      const revenueList = response.data.map((item: DailyPriceForShopResponse) => item.totalPriceForShop)
      const orderList = response_3.data.map((item: DailyOrderCountResponse) => item.count)
      const totalOrder = orderList.reduce((acc, num) => acc + num, 0)
      setChartSeries(transformedData)
      setPercentage(Object.values(response_2.data))
      setStatusLabel(Object.keys(response_2.data))
      setRevenueDayList(response.data)
      setDayList(dayList)
      setRevenue(revenueList)
      setOrderList(orderList)
      setAccountBalance(response_1.data['totalPriceForShop'])
      setTotalOrder(totalOrder)
    } catch (error) {
      console.error('Error fetching items:', (error as Error).message);
    }
  };

  useEffect(() => {
    if (userInfo !== null) {
      fetchData();
    }
  }, [userInfo]);

  const fetchAccountBalance = async () => {
    console.log(`${month} - ${year}`)
    const res = await OrderDetailService.getTotalPrice(userInfo.usersID, month, year, accessToken);
    console.log(res.data)
    setAccountBalance(res.data.totalPriceForShop)
  }

  const fetchChart = async () => {
    console.log(`${month} - ${year}`)
    try {
      let response = null
      let response_1 = null
      let response_2 = null
      fetchAccountBalance()
      response = await OrderDetailService.getRevenueEachDay(userInfo.usersID, month, year, accessToken);
      response_1 = await OrderDetailService.getTotalPrice(userInfo.usersID, month, year, accessToken);
      response_2 = await OrderDetailService.getOrderEachDay(userInfo.usersID, month, year, accessToken)
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);
      setRevenueDayList(response.data)
      const dayList = response.data.map((item: DailyPriceForShopResponse) => `Day ${item.day.toString()}`)
      const revenueList = response.data.map((item: DailyPriceForShopResponse) => item.totalPriceForShop)
      const orderList = response_2.data.map((item: DailyOrderCountResponse) => item.count)
      const totalOrder = orderList.reduce((acc, num) => acc + num, 0)
      setDayList(dayList)
      setRevenue(revenueList)
      setTotalOrder(totalOrder)
    } catch (error) {
      console.error('Error fetching items:', (error as Error).message);
    }
  }

  const calculateTotalNumberOfOrder = () => {
    let total: number = 0;
    for (let i = 0; i < orderList.length; i++) {
      total += orderList[i]
    }
    setTotalOrder(total)
  }

  return (
    <>
      <Helmet>
        <title>Crypto Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          username={userInfo?.accountName}
          userimage={userInfo?.coverImages}
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <AccountBalance
              chartSeries={chartSeries}
              percentage={percentage}
              statusLabel={statusLabel}
              monthArr={monthArr}
              yearArr={yearArr}
              colorArr={colorArr}
              accountBalance={accountBalance}
              month={month}
              year={year}
              setMonth={setMonth}
              setYear={setYear}
              fetchAccountBalance={fetchAccountBalance}
            />
          </Grid>
          <Grid item xs={12}>
            <WatchList
              monthArr={monthArr}
              yearArr={yearArr}
              accountBalance={accountBalance}
              month={month}
              year={year}
              setMonth={setMonth}
              setYear={setYear}
              dayList={dayList}
              revenueList={revenue}
              today={today}
              fetchAccountBalance={fetchAccountBalance}
              fetchChart={fetchChart}
              orderList={orderList}
              totalOrder={totalOrder}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCrypto;
