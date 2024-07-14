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
import OrderDetailService, {
  DailyOrderCountResponse,
  DailyPriceForAdminResponse,
  DailyPriceForShopResponse
} from 'src/api/OrderDetail.service';
import { setUser } from 'src/redux/slices/auth.slice';
import { useAppDispatch } from 'src/redux/store';
import jwt_decode from 'jwt-decode';
import UserService from '../../../api/User.services';
import BookingService from 'src/api/Booking.service';

export interface ChartSeries {
  name: string;
  value: number;
}

function DashboardCrypto() {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const today = new Date();
  const colorArr = ['#b2b5b2', '#8291ff', '#57ca22', '#e74c3c'];
  const [chartSeries, setChartSeries] = useState<ChartSeries[]>([]);
  const [percentage, setPercentage] = useState<number[]>([]);
  const [statusLabel, setStatusLabel] = useState<string[]>([]);
  const [revenueDayList, setRevenueDayList] =
    useState<DailyPriceForShopResponse[]>();
  const [dayList, setDayList] = useState<string[]>();
  const [revenue, setRevenue] = useState<number[]>();
  const [orderList, setOrderList] = useState<number[]>();
  const [completedBookingList, setCompletedBookingList] = useState<number[]>()
  const [completedBookingRevenueList, setCompletedBookingRevenueList] = useState<number[]>()
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [monthArr, setMonthArr] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
  ]);
  const [yearArr, setYearArr] = useState<number[]>(
    Array.from(
      { length: today.getFullYear() - 2000 + 1 },
      (_, i) => today.getFullYear() - i
    )
      .slice()
      .reverse()
  );
  const [month, setMonth] = useState<any>(today.getMonth() + 1);
  const [year, setYear] = useState<any>(today.getFullYear());
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [totalCompletedBookings, setTotalCompletedBookings] = useState<number>(0)
  let accessToken: string =
    useSelector((state: any) => state.auth.userToken) !== null
      ? useSelector((state: any) => state.auth.userToken)
      : localStorage.getItem('userToken');
  let [userInfo, setUserInfo] = useState<any>(
    useSelector((state: any) => state.auth.userInfo)
  );

  const getUserByEmail = async () => {
    var decoded = jwt_decode(accessToken);
    console.log(decoded);
    const response = await UserService.getUserByEmail(
      decoded['sub'],
      accessToken
    );
    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('userToken');
      navigate('/login');
      return;
    }
    setUserInfo(response.data['userInfo']);
    console.log(userInfo);
    dispatch(setUser(userInfo));
  };

  if (userInfo === null) {
    console.log('user is null');
    getUserByEmail();
  }
  const fetchData = async () => {
    try {
      let response = null;
      let response_1 = null;
      let response_2 = null;
      let response_3 = null;
      let response_4 = null
      let response_5 = null
      response =
        userInfo.role === 'ADMIN'
          ? await OrderDetailService.getRevenueEachDayAdmin(
            today.getMonth() + 1,
            today.getFullYear(),
            accessToken
          )
          : await OrderDetailService.getRevenueEachDay(
            userInfo.usersID,
            today.getMonth() + 1,
            today.getFullYear(),
            accessToken
          );
      response_1 =
        userInfo.role === 'ADMIN'
          ? await OrderDetailService.getTotalPriceAdmin(
            today.getMonth() + 1,
            today.getFullYear(),
            accessToken
          )
          : await OrderDetailService.getTotalPrice(
            userInfo.usersID,
            today.getMonth() + 1,
            today.getFullYear(),
            accessToken
          );
      response_2 =
        userInfo.role === 'ADMIN'
          ? await BookingService.getOrderStatusPercentageAdmin(accessToken)
          : await BookingService.getOrderStatusPercentage(
            userInfo.usersID,
            accessToken
          );
      response_3 =
        userInfo.role === 'ADMIN'
          ? await OrderDetailService.getOrderEachDayAdmin(
            today.getMonth() + 1,
            today.getFullYear(),
            accessToken
          )
          : await OrderDetailService.getOrderEachDay(
            userInfo.usersID,
            today.getMonth() + 1,
            today.getFullYear(),
            accessToken
          );
      response_4 = userInfo.role === 'ADMIN' ?
        await OrderDetailService.getCompletedBookingsAdmin(today.getMonth() + 1, today.getFullYear(), accessToken)
        :
        await OrderDetailService.getCompletedBookings(userInfo.usersID, today.getMonth() + 1, today.getFullYear(), accessToken)
      response_5 = userInfo.role === 'ADMIN' ?
        await OrderDetailService.getRevenueCompletedBookingsAdmin(today.getMonth() + 1, today.getFullYear(), accessToken)
        :
        await OrderDetailService.getRevenueCompletedBookings(userInfo.usersID, today.getMonth() + 1, today.getFullYear(), accessToken)

      console.log('Response data:', response.data);
      console.log('Response_1 data:', response_1.data);
      console.log('Response_2 data:', response_2.data);
      console.log('Response_3 data:', response_3.data);
      console.log("Response_4 data:", response_4.data)
      console.log("Response_5 data:", response_5.data)
      const transformedData: any = Object.entries(response_2.data).map(
        ([name, value]) => ({
          name,
          value
        })
      );
      const dayList = response.data.map(
        (item: DailyPriceForShopResponse) => `Day ${item.day.toString()}`
      );
      const revenueList =
        userInfo.role === 'ADMIN'
          ? response.data.map(
            (item: DailyPriceForAdminResponse) => item.totalPriceForAdmin
          )
          : response.data.map(
            (item: DailyPriceForShopResponse) => item.totalPriceForShop
          );
      const orderList = response_3.data.map(
        (item: DailyOrderCountResponse) => item.count
      );
      const completedBookingList = response_4.data.map((item: DailyOrderCountResponse) => item.count)
      const totalOrder = orderList.reduce((acc, num) => acc + num, 0);
      const totalCompletedBookings = completedBookingList.reduce((acc, num) => acc + num, 0)
      const completedBookingRevenueList = userInfo.role === 'ADMIN' ?
        response_5.data.map((item: DailyPriceForAdminResponse) => item.totalPriceForAdmin)
        :
        response_5.data.map((item: DailyPriceForShopResponse) => item.totalPriceForShop)
      setChartSeries(transformedData);
      setPercentage(Object.values(response_2.data));
      setStatusLabel(Object.keys(response_2.data));
      setRevenueDayList(response.data);
      setDayList(dayList);
      setRevenue(revenueList);
      setOrderList(orderList);
      setCompletedBookingList(completedBookingList)
      setCompletedBookingRevenueList(completedBookingRevenueList)
      setAccountBalance(
        userInfo.role === 'ADMIN'
          ? response_1.data['totalPriceForAdmin']
          : response_1.data['totalPriceForShop']
      );
      setTotalOrder(totalOrder);
      setTotalCompletedBookings(totalCompletedBookings)
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
    console.log(`${month} - ${year}`);
    const res = await OrderDetailService.getTotalPrice(
      userInfo.usersID,
      month,
      year,
      accessToken
    );
    console.log(res.data);
    setAccountBalance(res.data.totalPriceForShop);
  };

  const fetchChart = async () => {
    console.log(`${month} - ${year}`);
    try {
      let response = null;
      let response_1 = null;
      let response_2 = null;
      let response_3 = null
      let response_4 = null;
      response =
        userInfo.role === 'ADMIN'
          ? await OrderDetailService.getRevenueEachDayAdmin(
            month,
            year,
            accessToken
          )
          : await OrderDetailService.getRevenueEachDay(
            userInfo.usersID,
            month,
            year,
            accessToken
          );
      response_1 =
        userInfo.role === 'ADMIN'
          ? await OrderDetailService.getTotalPriceAdmin(
            month,
            year,
            accessToken
          )
          : await OrderDetailService.getTotalPrice(
            userInfo.usersID,
            month,
            year,
            accessToken
          );
      response_2 =
        userInfo.role === 'ADMIN'
          ? await OrderDetailService.getOrderEachDayAdmin(
            month,
            year,
            accessToken
          )
          : await OrderDetailService.getOrderEachDay(
            userInfo.usersID,
            month,
            year,
            accessToken
          );
      response_3 = userInfo.role === 'ADMIN' ?
        await OrderDetailService.getCompletedBookingsAdmin(month, year, accessToken)
        :
        await OrderDetailService.getCompletedBookings(userInfo.usersID, month, year, accessToken)
      response_4 = userInfo.role === 'ADMIN' ?
        await OrderDetailService.getRevenueCompletedBookingsAdmin(month, year, accessToken)
        :
        await OrderDetailService.getRevenueCompletedBookings(userInfo.usersID, month, year, accessToken)

      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);
      setRevenueDayList(response.data);
      const dayList = response.data.map(
        (item: DailyPriceForShopResponse) => `Day ${item.day.toString()}`
      );
      const revenueList =
        userInfo.role === 'ADMIN'
          ? response.data.map(
            (item: DailyPriceForAdminResponse) => item.totalPriceForAdmin
          )
          : response.data.map(
            (item: DailyPriceForShopResponse) => item.totalPriceForShop
          );
      const orderList = response_2.data.map(
        (item: DailyOrderCountResponse) => item.count
      );
      const totalOrder = orderList.reduce((acc, num) => acc + num, 0);
      const completedBookingList = response_3.data.map((item: DailyOrderCountResponse) => item.count)
      const totalCompletedBookings = completedBookingList.reduce((acc, num) => acc + num, 0)
      const completedBookingRevenueList = userInfo.role === 'ADMIN' ?
        response_4.data.map((item: DailyPriceForAdminResponse) => item.totalPriceForAdmin)
        :
        response_4.data.map((item: DailyPriceForShopResponse) => item.totalPriceForShop)
      setDayList(dayList);
      setRevenue(revenueList);
      setTotalOrder(totalOrder);
      setOrderList(orderList);
      setAccountBalance(userInfo.role === 'ADMIN' ? response_1.data['totalPriceForAdmin'] : response_1.data['totalPriceForShop'])
      setCompletedBookingList(completedBookingList)
      setCompletedBookingRevenueList(completedBookingRevenueList)
      setTotalCompletedBookings(totalCompletedBookings)
    } catch (error) {
      console.error('Error fetching items:', (error as Error).message);
    }
  };

  const calculateTotalNumberOfOrder = () => {
    let total: number = 0;
    for (let i = 0; i < orderList.length; i++) {
      total += orderList[i];
    }
    setTotalOrder(total);
  };

  return (
    <>
      <Helmet>
        <title>Admin Rosaceae</title>
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
          {userInfo !== null ? <>
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
                user={userInfo}
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
                completedBookingList={completedBookingList}
                completedBookingRevenueList={completedBookingRevenueList}
                totalOrder={totalOrder}
                totalCompletedBooking={totalCompletedBookings}
              />
            </Grid>
          </> : null
          }
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCrypto;
