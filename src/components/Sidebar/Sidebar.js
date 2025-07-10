import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dismissAlert } from '../../actions/alerts';
import s from './Sidebar.module.scss';
import LinksGroup from './LinksGroup/LinksGroup';
import { openSidebar, closeSidebar, changeActiveSidebarItem } from '../../actions/navigation';
import isScreen from '../../core/screenHelper';
import { logoutUser } from '../../actions/auth';
import { withRouter } from 'react-router-dom';

import Home from '../../images/sidebar/basil/Home';
import User from '../../images/sidebar/basil/User';
import Chat from '../../images/sidebar/basil/Chat';
import Stack from '../../images/sidebar/basil/Stack';
import Envelope from '../../images/sidebar/basil/Envelope';
import Document from '../../images/sidebar/basil/Document';
import Apps from '../../images/sidebar/basil/Apps';
import Asana from '../../images/sidebar/basil/Asana';
import Columns from '../../images/sidebar/basil/Columns';
import ChartPieAlt from '../../images/sidebar/basil/ChartPieAlt';
import Layout from '../../images/sidebar/basil/Layout';
import Rows from '../../images/sidebar/basil/Rows';
import Location from '../../images/sidebar/basil/Location';
import Fire from '../../images/sidebar/basil/Fire';
import Menu from '../../images/sidebar/basil/Menu';

class Sidebar extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    sidebarOpened: false,
    activeItem: '',
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.doLogout = this.doLogout.bind(this);
  }

  onMouseEnter() {
    if (!this.props.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
      const paths = this.props.location.pathname.split('/');
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join('/')));
    }
  }

  onMouseLeave() {
    if (!this.props.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    }
  }

  dismissAlert(id) {
    this.props.dispatch(dismissAlert(id));
  }

  doLogout() {
    this.props.dispatch(logoutUser());
  }

  render() {
    const { currentUser } = this.props;
    const role = currentUser?.role;
    return (
      <div className={`${(!this.props.sidebarOpened && !this.props.sidebarStatic ) ? s.sidebarClose : ''} ${s.sidebarWrapper}`}>
      <nav
        onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
        className={s.root}
      >
        <header className={s.logo}>
          {/* Changed logo link from /app/main/dashboard to /app/gigs to avoid broken dashboard route. Restore if dashboard is fixed. */}
          <a href="/app/gigs"><span className={s.logoStyle}>BioShift <span className={s.logoPart}></span></span></a>
        </header>
        <ul className={s.nav}>
          <h5 className={s.navTitle}>BioShift</h5>
          {/* Dashboard link removed due to persistent blank page and route issues. Restore if dashboard is fixed. */}
          {/* <LinksGroup
            header="Dashboard"
            iconElement={<Home />}
            link="/app/main"
            isHeader
            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
            activeItem={this.props.activeItem}
          /> */}
          {/* Profile section for all roles */}
          <LinksGroup
            header="Profile"
            iconElement={<User />}
            isHeader
            index="profile"
            childrenLinks={[
              { header: 'My Profile', link: '/app/profile' },
              { header: 'Edit Profile', link: '/app/edit_profile' },
              { header: 'Upskill', link: '/app/upskill' },
              { header: 'Change Password', link: '/app/password' },
              { header: 'Payments/Banking', link: '/app/payments' },
              { header: 'History', link: '/app/history' },
              { header: 'Startups', link: '/app/startups' },
              { header: 'Documents', link: '/app/documents' },
              { header: 'Publications', link: '/app/publications' },
              { header: 'Patents', link: '/app/patents' },
              { header: 'My LabLeap Bionics', link: '/app/bionics' },
            ]}
            onActiveSidebarItemChange={() => this.props.dispatch(changeActiveSidebarItem('profile'))}
            activeItem={this.props.activeItem}
          />
          {/* LabLeap section for all except admin */}
          {role !== 'Admin' && (
            <>
              <h5 className={s.navTitle}>LabLeap</h5>
              <LinksGroup
                header="Gigs"
                iconElement={<Stack />}
                isHeader
                index="gigs"
                childrenLinks={[
                  // Labs can see their gigs and post new ones
                  (role === 'Lab') && { header: 'My Gigs', link: '/app/my-gigs' },
                  (role === 'Lab') && { header: 'Post a Gig', link: '/app/post-gig' },
                  // Workers can see all gigs and their applications
                  (role === 'Worker') && { header: 'My Applications', link: '/app/my-applications' },
                  // Everyone can browse gigs (Workers apply, Labs manage, Providers browse)
                  { header: 'Browse Gigs', link: '/app/gigs' },
                  // Role-dependent Suggested item
                  (role === 'Worker')
                    ? { header: 'Suggested Gigs', link: '/app/suggested' }
                    : (role === 'Lab')
                    ? { header: 'Suggested Talent', link: '/app/suggested' }
                    : (role === 'Provider')
                    ? { header: 'Suggested Labs', link: '/app/suggested' }
                    : { header: 'Suggested', link: '/app/suggested' },
                ].filter(Boolean)}
                onActiveSidebarItemChange={() => this.props.dispatch(changeActiveSidebarItem('gigs'))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                header="Offerings"
                iconElement={<Asana />}
                isHeader
                index="offerings"
                childrenLinks={[
                  // Only Labs and Workers should browse offerings
                  (role === 'Lab' || role === 'Worker') && { header: 'Browse Offerings', link: '/app/offerings' },
                  // Only Providers can manage offerings
                  (role === 'Provider') && { header: 'My Offerings', link: '/app/offerings' },
                  (role === 'Provider') && { header: 'Create New Offering', link: '/app/offerings/create' }
                ].filter(Boolean)}
                onActiveSidebarItemChange={() => this.props.dispatch(changeActiveSidebarItem('offerings'))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                header="Chat"
                iconElement={<Chat />}
                link="/app/chat"
                isHeader
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                header="Messages"
                iconElement={<Envelope />}
                link="/app/inbox"
                isHeader
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                header="BioShift Connect"
                iconElement={<Document />}
                link="/app/connect"
                isHeader
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
            </>
          )}
          {/* Admin Dashboard only for admin */}
          {role === 'Admin' && (
            <>
              <h5 className={s.navTitle}>Admin Dashboard</h5>
              <LinksGroup
                header="Dashboard"
                iconElement={<Home />}
                link="/app/main"
                isHeader
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                header="Users"
                iconElement={<User />}
                link="/admin/users"
                isHeader
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                header="Chat"
                iconElement={<Chat />}
                link="/app/chat"
                isHeader
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                header="E-Commerce"
                iconElement={<Stack />}
                link="/app/ecommerce"
                isHeader
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                header="Sing Package"
                iconElement={<Stack />}
                link="/app/package"
                isHeader
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                header="Email"
                iconElement={<Envelope />}
                link="/app/inbox"
                isHeader
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                header="Documentation"
                iconElement={<Document />}
                link="/documentation"
                isHeader
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
            </>
          )}
          {/* Template options only for Admin */}
          {role === 'admin' && (
            <>
              <h5 className={s.navTitle}>Template</h5>
              <LinksGroup
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
                header="Core"
                isHeader
                iconElement={<Apps/>}
                iconName="flaticon-network"
                link="/app/core"
                index="core"
                childrenLinks={[
                  {
                    header: 'Typography', link: '/app/core/typography',
                  },
                  {
                    header: 'Colors', link: '/app/core/colors',
                  },
                  {
                    header: 'Grid', link: '/app/core/grid',
                  },
                ]}
              />
              <LinksGroup
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
                header="UI Elements"
                isHeader
                iconElement={<Asana/>}
                iconName="flaticon-layers"
                link="/app/ui"
                index="ui"
                childrenLinks={[
                  {
                    header: 'Alerts', link: '/app/ui/alerts',
                  },
                  {
                    header: 'Badge', link: '/app/ui/badge',
                  },
                  {
                    header: 'Buttons', link: '/app/ui/buttons',
                  },
                  {
                    header: 'Card', link: '/app/ui/card',
                  },
                  {
                    header: 'Carousel', link: '/app/ui/carousel',
                  },
                  {
                    header: 'Jumbotron', link: '/app/ui/jumbotron',
                  },
                  {
                    header: 'Icons', link: '/app/ui/icons',
                  },
                  {
                    header: 'List Groups', link: '/app/ui/list-groups',
                  },
                  {
                    header: 'Modal', link: '/app/ui/modal',
                  },
                  {
                    header: 'Nav', link: '/app/ui/nav',
                  },
                  {
                    header: 'Navbar', link: '/app/ui/navbar',
                  },
                  {
                    header: 'Notifications', link: '/app/ui/notifications',
                  },
                  {
                    header: 'Pagination', link: '/app/tables/dynamic',
                  },
                  {
                    header: 'Popovers & Tooltips', link: '/app/ui/popovers',
                  },
                  {
                    header: 'Progress', link: '/app/ui/progress',
                  },
                  {
                    header: 'Tabs & Accordion', link: '/app/ui/tabs-accordion',
                  },
                ]}
              />
              <LinksGroup
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
                header="Forms"
                isHeader
                iconElement={<Columns/>}
                iconName="flaticon-list"
                link="/app/forms"
                index="forms"
                childrenLinks={[
                  {
                    header: 'Forms Elements', link: '/app/forms/elements',
                  },
                  {
                    header: 'Forms Validation', link: '/app/forms/validation',
                  },
                  {
                    header: 'Forms Wizard', link: '/app/forms/wizard',
                  },
                ]}
              />
              <LinksGroup
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
                header="Charts"
                link="/app/charts"
                isHeader
                iconElement={<ChartPieAlt/>}
                iconName="flaticon-controls"
                index="charts"
                childrenLinks={[
                  {
                    header: 'Charts Overview', link: '/app/charts/overview',
                  },
                  {
                    header: 'Apex Charts', link: '/app/charts/apex',
                  },
                  {
                    header: 'Echarts Charts', link: '/app/charts/echarts',
                  },
                  {
                    header: 'Highcharts Charts', link: '/app/charts/highcharts',
                  },
                ]}
              />
              <LinksGroup
                header="Grid"
                link="/app/grid"
                iconElement={<Layout/>}
                isHeader
                iconName="flaticon-menu-4"
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
              />
              <LinksGroup
                onActiveSidebarItemChange={t => this.props.dispatch(changeActiveSidebarItem(t))}
                activeItem={this.props.activeItem}
                header="Tables"
                isHeader
                iconElement={<Rows/>}
                iconName="flaticon-equal-1"
                link="/app/tables"
                index="tables"
                childrenLinks={[
                  {
                    header: 'Tables Basic', link: '/app/tables/static',
                  },
                  {
                    header: 'Tables Dynamic', link: '/app/tables/dynamic',
                  },
                ]}
              />
              <LinksGroup
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
                header="Maps"
                isHeader
                iconElement={<Location/>}
                iconName="flaticon-map-location"
                link="/app/maps"
                index="maps"
                childrenLinks={[
                  {
                    header: 'Google Maps', link: '/app/maps/google',
                  },
                  {
                    header: 'Vector Map', link: '/app/maps/vector',
                  },
                ]}
              />
              <LinksGroup
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
                header="Extra"
                isHeader
                iconElement={<Fire/>}
                iconName="flaticon-star"
                link="/app/extra"
                index="extra"
                childrenLinks={[
                  {
                    header: 'Calendar', link: '/app/extra/calendar',
                  },
                  {
                    header: 'Invoice', link: '/app/extra/invoice',
                  },
                  {
                    header: 'Login Page', link: '/app/loginpage',
                  },
                  {
                    header: 'Error Page', link: '/error',
                  },
                  {
                    header: 'Gallery', link: '/app/extra/gallery',
                  },
                  {
                    header: 'Search Result', link: '/app/extra/search',
                  },
                  {
                    header: 'Time line', link: '/app/extra/timeline',
                  },
                ]}
              />
              <LinksGroup
                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                activeItem={this.props.activeItem}
                header="Menu Levels"
                isHeader
                iconElement={<Menu/>}
                iconName="flaticon-folder-10"
                link="/app/menu"
                index="menu"
                childrenLinks={[
                  {
                    header: 'Level 1.1', link: '/app/menu/level1',
                  },
                  {
                    header: 'Level 1.2',
                    link: '/app/menu/level_12',
                    index: 'level_12',
                    childrenLinks: [
                      {
                        header: 'Level 2.1',
                        link: '/app/menu/level_12/level_21',
                        index: 'level_21',
                      },
                      {
                        header: 'Level 2.2',
                        link: '/app/menu/level_12/level_22',
                        index: 'level_22',
                        childrenLinks: [
                          {
                            header: 'Level 3.1',
                            link: '/app/menu/level_12/level_22/level_31',
                            index: 'level_31',
                          },
                          {
                            header: 'Level 3.2',
                            link: '/app/menu/level_12/level_22/level_32',
                            index: 'level_32 ',
                          },
                        ],
                      },
                      {
                        header: 'Level 2.3',
                        link: '/app/menu/level_12/level_23',
                        index: 'level_23',
                      },
                    ],
                  },
                ]}
              />
            </>
          )}
          {/* Projects for Lab, Worker, Provider */}
          {(role === 'Lab' || role === 'Worker' || role === 'Provider') && (
            <>
              <h5 className={s.navTitle}>BioShift Gigs & Projects</h5>
              <div className={s.sidebarAlerts}>
                <div className={`${s.sidebarAlert} alert alert-transparent alert-dismissible fade show`} role="alert">
                  <button type="button" className="btn-close" aria-label="Close"></button>
                  <span>Protein Purification Gig</span><br />
                  <div className={`${s.sidebarProgress} sidebar-bottom-aler-primary progress-xs mt-1 progress`}>
                    <div className="progress-bar bg-unset" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" style={{width: '72%'}}></div>
                  </div>
                  <small>In progress · 72% complete</small>
                </div>
                <div className={`${s.sidebarAlert} alert alert-transparent alert-dismissible fade show`} role="alert">
                  <button type="button" className="btn-close" aria-label="Close"></button>
                  <span>Genomics Data Analysis</span><br />
                  <div className={`${s.sidebarProgress} sidebar-bottom-aler-success progress-xs mt-1 progress`}>
                    <div className="progress-bar bg-unset" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style={{width: '45%'}}></div>
                  </div>
                  <small>Awaiting results · 45% complete</small>
                </div>
                <div className={`${s.sidebarAlert} alert alert-transparent alert-dismissible fade show`} role="alert">
                  <button type="button" className="btn-close" aria-label="Close"></button>
                  <span>Automation Setup Project</span><br />
                  <div className={`${s.sidebarProgress} sidebar-bottom-aler-warning progress-xs mt-1 progress`}>
                    <div className="progress-bar bg-unset" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style={{width: '90%'}}></div>
                  </div>
                  <small>Finalizing · 90% complete</small>
                </div>
                <div className={`${s.sidebarAlert} alert alert-transparent alert-dismissible fade show`} role="alert">
                  <button type="button" className="btn-close" aria-label="Close"></button>
                  <span>CRISPR Screening Gig</span><br />
                  <div className={`${s.sidebarProgress} sidebar-bottom-aler-info progress-xs mt-1 progress`}>
                    <div className="progress-bar bg-unset" role="progressbar" aria-valuenow="28" aria-valuemin="0" aria-valuemax="100" style={{width: '28%'}}></div>
                  </div>
                  <small>New applicant · 28% complete</small>
                </div>
              </div>
            </>
          )}
        </ul>
      </nav >
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    alertsList: store.alerts.alertsList,
    activeItem: store.navigation.activeItem,
    navbarType: store.navigation.navbarType,
    sidebarColor: store.layout.sidebarColor,
    currentUser: store.auth.currentUser, // Inject current user from Redux
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
