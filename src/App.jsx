import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import TopNavbar from "./components/Nav/TopNavbar";
import Bookings from "./components/Sections/Bookings/Bookings";
import CancelBooking from "./components/Sections/Bookings/CancelBooking";
import Reschedule from "./components/Sections/Bookings/Reschedule";
import BookingTypes from "./components/Sections/BookingTypes/BookingTypes";
import Footer from "./components/Sections/BookingTypes/Footer/Footer";
import NewBooking from "./components/Sections/BookingTypes/NewBooking/NewBooking";
import EditPage from "./components/Sections/BookingTypes/EditPage/EditPage";
import Contacts from "./components/Sections/contacts/Contacts";
import ViewPage from "./components/Sections/BookingTypes/ViewPage/ViewPage";
import Integrations from "./components/Sections/Integrations/Integrations";
import SignUp from "./components/Sections/SignUp/SignUp";
import Profile from "./components/Sections/Profile/Profile";
import Login from "./components/Sections/Login/Login";
import Forgot from "./components/Sections/Login/Forgot";
import CreateNewBooking from "./components/Sections/Bookings/CreateNewBooking";
// import Landing from "./components/Sections/LandingPage/Landing";
import TopNavbarLoggedIn from "./components/Nav/TopNavbarLogedIn";
import Admin from "./components/Sections/admin/Admin";
import Users from "./components/Sections/admin/Users";
import BookingsAdmin from "./components/Sections/admin/BookingsAdmin";
import ForgetPassword from "./components/Sections/ForgetPassword/ForgetPassword";
import Razorpay from "./components/Sections/admin/Razorpay";
import PricingCards from "./components/Sections/PricingCards/PricingCards";
import PlanPayments from "./components/Sections/PlanPayments/PlanPayments";
import LandingPage from "./components/Sections/LandingPage/Landing";
import PrivacyPolicy from "./components/Sections/privacy-policy/PrivacyPolicy";
import TermCondition from "./components/Sections/privacy-policy/TermCondition";
import Refundpoilcy from "./components/Sections/privacy-policy/Refundpoilcy";

const App = () => {
  let isAuth = localStorage.getItem("_a");
  const userRole = localStorage.getItem("userRole");
  return (
    <BrowserRouter>
      {userRole !== "super-admin" && (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {isAuth === "true" ? (
              <>
                {/* <SidebarLogged/> */}
                <TopNavbarLoggedIn />
                <Switch>
                  <Route exact path="/pricing" component={PricingCards} />
                  <Route
                    exact
                    path="/planPayments/:month"
                    component={PlanPayments}
                  />
                  <Route exact path="/" component={BookingTypes} />
                  {/* <Route exact path="/BookingTypes" component={BookingTypes} /> */}
                  <Route exact path="/Bookings" component={Bookings} />
                  <Route exact path="/Contacts" component={Contacts} />
                  <Route
                    exact
                    path="/Schedule/:userId/:id"
                    component={Reschedule}
                  />
                  <Route
                    exact
                    path="/Reschedule/:userId/:BookingsTypeId/:id"
                    component={CreateNewBooking}
                  />
                  <Route exact path="/create" component={NewBooking} />
                  <Route exact path="/id/:id" component={ViewPage} />
                  <Route
                    exact
                    path="/CancelBooking/:id"
                    component={CancelBooking}
                  />
                  <Route exact path="/Integrations" component={Integrations} />
                  <Route exact path="/edit/:id" component={EditPage} />
                  <Route exact path="/Profile" component={Profile} />
                  <Route
                    exact
                    path="/privacy-policy"
                    component={PrivacyPolicy}
                  />
                  <Route
                    exact
                    path="/terms-condition"
                    component={TermCondition}
                  />
                  <Route exact path="/refund-policy" component={Refundpoilcy} />
                </Switch>
              </>
            ) : (
              <>
                {/* <Sidebar/> */}
                <TopNavbar />
                <Switch>
                  <Route exact path="/" component={LandingPage} />
                  {/* <Route exact path="/" component={Login} /> */}
                  <Route exact path="/Login" component={Login} />
                  <Route exact path="/SignUp" component={SignUp} />
                  <Route exact path="/Forgot" component={Forgot} />
                  <Route exact path="/pricing" component={PricingCards} />
                  <Route
                    exact
                    path="/Schedule/:userId/:id"
                    component={Reschedule}
                  />
                  <Route
                    exact
                    path="/ForgetPassword/:email"
                    component={ForgetPassword}
                  />
                  <Route
                    exact
                    path="/privacy-policy"
                    component={PrivacyPolicy}
                  />
                  <Route
                    exact
                    path="/terms-condition"
                    component={TermCondition}
                  />
                  <Route exact path="/refund-policy" component={Refundpoilcy} />
                </Switch>
              </>
            )}
          </div>
          <Footer />
        </div>
      )}
      {userRole === "super-admin" && isAuth === "true" && (
        <>
          <Admin />
          <Switch>
            <Route exact path="/" component={Users} />
            <Route exact path="/BookingsAdmin" component={BookingsAdmin} />
            <Route exact path="/Razorpay" component={Razorpay} />
          </Switch>
        </>
      )}
    </BrowserRouter>
    //  <Landing />
  );
};

export default App;
