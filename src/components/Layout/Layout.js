import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Hammer from 'rc-hammerjs';

import Profile from '../../pages/profile';
import Login from '../../pages/login';
import UIButtons from '../../pages/ui-elements/buttons';
import UIIcons from '../../pages/ui-elements/icons';
import UITabsAccordion from '../../pages/ui-elements/tabs-accordion/';
import UINotifications from '../../pages/ui-elements/notifications';
import UIListGroups from '../../pages/ui-elements/list-groups';
import FormsElements from '../../pages/forms/elements';
import FormsValidation from '../../pages/forms/validation';
import FormsWizard from '../../pages/forms/wizard';
import TablesStatic from '../../pages/tables/static';
import TablesDynamic from '../../pages/tables/dynamic';
import MapsGoogle from '../../pages/maps/google';
import MapsVector from '../../pages/maps/vector';
import ExtraCalendar from '../../pages/extra/calendar';
import ExtraInvoice from '../../pages/extra/invoice';
import ExtraSearch from '../../pages/extra/search';
import ExtraTimeline from '../../pages/extra/timeline';
import ExtraGallery from '../../pages/extra/gallery';
import Grid from '../../pages/grid';
import ChatPage from '../../pages/chat';
import Widgets from '../../pages/widgets';
import Products from '../../pages/products';
import Management from '../../pages/management';
import Product from '../../pages/product';
import Package from '../../pages/package';
import Email from '../../pages/email';
import CoreTypography from '../../pages/core/typography';
import CoreColors from '../../pages/core/colors';
import CoreGrid from '../../pages/core/grid';
import UIAlerts from '../../pages/ui-elements/alerts';
import UIBadge from '../../pages/ui-elements/badge';
import UICard from '../../pages/ui-elements/card';
import UICarousel from '../../pages/ui-elements/carousel';
import UIJumbotron from '../../pages/ui-elements/jumbotron';
import UIModal from '../../pages/ui-elements/modal';
import UIProgress from '../../pages/ui-elements/progress';
import UINavbar from '../../pages/ui-elements/navbar';
import UINav from '../../pages/ui-elements/nav';
import UIPopovers from '../../pages/ui-elements/popovers';
import Charts from '../../pages/charts';
import ApexCharts from '../../pages/charts/apex';
import Echarts from '../../pages/charts/echarts';
import HighCharts from '../../pages/charts/highcharts';
import DashboardAnalytics from '../../pages/analytics';
import UserFormPage from '../Users/form/UsersFormPage';
import UserListPage from '../Users/list/UsersListPage';
import UserViewPage from '../Users/view/UsersViewPage';
import ChangePasswordFormPage from '../Users/changePassword/ChangePasswordFormPage';
import { SidebarTypes } from '../../reducers/layout';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Helper from '../Helper';
import { openSidebar, closeSidebar, toggleSidebar } from '../../actions/navigation';
import s from './Layout.module.scss';
import { DashboardThemes } from '../../reducers/layout';
import ProductEdit from '../../pages/management/components/productEdit';
import BreadcrumbHistory from '../BreadcrumbHistory';
import { GigsListPage, GigDetailsPage, MyGigsPage, SuggestedPage, EditGigPage } from '../../pages/gigs';
import PostGigPage from '../../pages/gigs/PostGigPage';
import LabDashboardPage from '../../pages/dashboard/LabDashboardPage';
import WorkerDashboardPage from '../../pages/dashboard/WorkerDashboardPage';
import LabsListPage from '../../pages/labs/LabsListPage';

import PaymentsBanking from '../../pages/profile/payments/PaymentsBanking';
import Upskill from '../../pages/profile/upskill/Upskill';
import History from '../../pages/profile/history/History';
import Startups from '../../pages/profile/startups/Startups';
import Documents from '../../pages/profile/documents/Documents';
import Publications from '../../pages/profile/publications/Publications';
import Patents from '../../pages/profile/patents/Patents';
import Bionics from '../../pages/profile/bionics/Bionics';
import Connect from '../../pages/connect/Connect';
import MyApplicants from '../../pages/gigs/MyApplicants';
import MyApplications from '../../pages/applications/MyApplications';
import Offerings from '../../pages/offerings/Offerings';
import Offering from '../../pages/offerings/Offering';
import PostOfferingPage from '../../pages/offerings/PostOfferingPageNew';
import PublicProfilePage from '../../pages/profile/PublicProfilePage';
import Dashboard from '../../pages/dashboard/Dashboard';

class Layout extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dashboardTheme: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    sidebarOpened: false,
    dashboardTheme: DashboardThemes.DARK
  };
  constructor(props) {
    super(props);

    this.handleSwipe = this.handleSwipe.bind(this);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    if (window.innerWidth <= 768 && this.props.sidebarStatic) {
      this.props.dispatch(toggleSidebar());
    }
  }

  handleSwipe(e) {
    if ('ontouchstart' in window) {
      if (e.direction === 4) {
        this.props.dispatch(openSidebar());
        return;
      }

      if (e.direction === 2 && this.props.sidebarOpened) {
        this.props.dispatch(closeSidebar());
        return;
      }
    }
  }

  render() {
    console.log('Layout currentUser:', this.props.currentUser);
    return (
      <div
        className={[
          s.root,
          this.props.sidebarStatic ? `${s.sidebarStatic}` : '',
          !this.props.sidebarOpened ? s.sidebarClose : '',
          'sing-dashboard',
          `dashboard-${(localStorage.getItem("sidebarType") === SidebarTypes.TRANSPARENT) ? "light" : localStorage.getItem("dashboardTheme")}`,
          `header-${localStorage.getItem("navbarColor") ? localStorage.getItem("navbarColor").replace('#', '') : 'FFFFFF'}`
        ].join(' ')}
      >
        <Sidebar />
        <div className={s.wrap}>
          <Header />
          <Helper />
          
          <Hammer onSwipe={this.handleSwipe}>
            <main className={s.content}>
            <BreadcrumbHistory url={this.props.location.pathname} />
              <TransitionGroup>
                <CSSTransition
                  key={this.props.location.key}
                  classNames="fade"
                  timeout={200}
                >
                  <Switch>
                    <Route path="/app/main" exact render={() => <Redirect to="/app/gigs" />} />
                    <Route path="/app/main/dashboard" exact render={() => <Redirect to="/app/gigs" />} />
                    <Route path="/app/main/widgets" exact component={Widgets} />
                    <Route path="/app/main/analytics" exact component={DashboardAnalytics} />
                    <Route path="/app/edit_profile" exact component={UserFormPage} />
                    <Route path="/app/password" exact component={ChangePasswordFormPage} />
                    <Route path="/admin" exact render={() => <Redirect to="/admin/users" />} />
                    <Route path="/admin/users" exact component={UserListPage} />
                    <Route path="/admin/users/new" exact component={UserFormPage} />
                    <Route path="/admin/users/:id/edit" exact component={UserFormPage} />
                    <Route path="/admin/users/:id" exact component={UserViewPage} />
                    <Route path="/app/ecommerce" exact render={() => <Redirect to="/app/ecommerce/management" />} />
                    <Route path="/app/ecommerce/management" exact component={Management} />
                    <Route path="/app/ecommerce/management/:id" exact component={ProductEdit} />
                    <Route path="/app/ecommerce/management/create" exact component={ProductEdit} />
                    <Route path="/app/ecommerce/products" exact component={Products} />
                    <Route path="/app/ecommerce/product" exact component={Product} />
                    <Route path="/app/ecommerce/product/:id" exact component={Product} />
                    <Route path="/app/profile" exact component={Profile} />
                    <Route path="/app/loginpage" exact component={Login} />
                    <Route path="/app/inbox" exact component={Email} />
                    <Route path="/app/ui" exact render={() => <Redirect to="/app/ui/components" />} />
                    <Route path="/app/ui/buttons" exact component={UIButtons} />
                    <Route path="/app/ui/icons" exact component={UIIcons} />
                    <Route path="/app/ui/tabs-accordion" exact component={UITabsAccordion} />
                    <Route path="/app/ui/notifications" exact component={UINotifications} />
                    <Route path="/app/ui/list-groups" exact component={UIListGroups} />
                    <Route path="/app/ui/alerts" exact component={UIAlerts} />
                    <Route path="/app/ui/badge" exact component={UIBadge} />
                    <Route path="/app/ui/card" exact component={UICard} />
                    <Route path="/app/ui/carousel" exact component={UICarousel} />
                    <Route path="/app/ui/jumbotron" exact component={UIJumbotron} />
                    <Route path="/app/ui/modal" exact component={UIModal} />
                    <Route path="/app/ui/popovers" exact component={UIPopovers} />
                    <Route path="/app/ui/progress" exact component={UIProgress} />
                    <Route path="/app/ui/navbar" exact component={UINavbar} />
                    <Route path="/app/ui/nav" exact component={UINav} />
                    <Route path="/app/grid" exact component={Grid} />
                    <Route path="/app/chat" exact component={ChatPage} />
                    <Route path="/app/package" exact component={Package} />
                    <Route path="/app/forms" exact render={() => <Redirect to="/app/forms/elements" />} />
                    <Route path="/app/forms/elements" exact component={FormsElements} />
                    <Route path="/app/forms/validation" exact component={FormsValidation} />
                    <Route path="/app/forms/wizard" exact component={FormsWizard} />
                    <Route path="/app/charts/" exact render={() => <Redirect to="/app/charts/overview" />} />
                    <Route path="/app/charts/overview" exact component={Charts} />
                    <Route path="/app/charts/apex" exact component={ApexCharts} />
                    <Route path="/app/charts/echarts" exact component={Echarts} />
                    <Route path="/app/charts/highcharts" exact component={HighCharts} />
                    <Route path="/app/tables" exact render={() => <Redirect to="/app/tables/static" />} />
                    <Route path="/app/tables/static" exact component={TablesStatic} />
                    <Route path="/app/tables/dynamic" exact component={TablesDynamic} />
                    <Route path="/app/extra" exact render={() => <Redirect to="/app/extra/calendar" />} />
                    <Route path="/app/extra/calendar" exact component={ExtraCalendar} />
                    <Route path="/app/extra/invoice" exact component={ExtraInvoice} />
                    <Route path="/app/extra/search" exact component={ExtraSearch} />
                    <Route path="/app/extra/timeline" exact component={ExtraTimeline} />
                    <Route path="/app/extra/gallery" exact component={ExtraGallery} />
                    <Route path="/app/maps" exact render={() => <Redirect to="/app/maps/google" />} />
                    <Route path="/app/maps/google" exact component={MapsGoogle} />
                    <Route path="/app/maps/vector" exact component={MapsVector} />
                    <Route path="/app/core" exact render={() => <Redirect to="/app/core/typography" />} />
                    <Route path="/app/core/typography" exact component={CoreTypography} />
                    <Route path="/app/core/colors" exact component={CoreColors} />
                    <Route path="/app/core/grid" exact component={CoreGrid} />
                    <Route path="/app/gigs" exact component={GigsListPage} />
                    <Route path="/app/gigs/edit/:id" exact component={EditGigPage} />
                    <Route path="/app/gigs/:id/applicants" exact component={MyApplicants} />
                    <Route path="/app/gigs/:id" exact component={GigDetailsPage} />
                    <Route path="/app/my-gigs" exact component={MyGigsPage} />
                    <Route path="/app/my-applications" exact component={MyApplications} />
                    <Route path="/app/suggested" exact component={SuggestedPage} />
                    <Route path="/app/post-gig" exact component={PostGigPage} />
                    <Route path="/app/dashboard/lab" exact component={LabDashboardPage} />
                    <Route path="/app/dashboard/worker" exact component={WorkerDashboardPage} />
                    <Route path="/app/labs" exact component={LabsListPage} />
                    <Route path="/app/payments" exact component={PaymentsBanking} />
                    <Route path="/app/upskill" exact component={Upskill} />
                    <Route path="/app/history" exact component={History} />
                    <Route path="/app/startups" exact component={Startups} />
                    <Route path="/app/documents" exact component={Documents} />
                    <Route path="/app/publications" exact component={Publications} />
                    <Route path="/app/patents" exact component={Patents} />
                    <Route path="/app/bionics" exact component={Bionics} />
                    <Route path="/app/connect" exact component={Connect} />
                    <Route path="/app/offerings/create" exact component={PostOfferingPage} />
                    <Route path="/app/offerings/:id" exact component={Offering} />
                    <Route path="/app/offerings" exact component={Offerings} />
                    <Route path="/app/profile/:userId" exact component={PublicProfilePage} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
              <footer className={s.contentFooter}>
                © 2025 BioShift. All rights reserved. LabLeap™ is a trademark of BioShift.
              </footer>
            </main>
          </Hammer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    dashboardTheme: store.layout.dashboardTheme,
    navbarColor: store.layout.navbarColor,
    sidebarType: store.layout.sidebarType,
    currentUser: store.auth.currentUser,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
