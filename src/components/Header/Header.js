import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  Navbar,
  Nav,
  Dropdown,
  NavItem,
  NavLink,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  Input,
  Form,
  FormGroup,
} from 'reactstrap';
import cx from 'classnames';
import { NavbarTypes } from '../../reducers/layout';
import Notifications from '../Notifications/Notifications';
import { logoutUser } from '../../actions/auth';
import api from '../../services/api';
// import Joyride, { STATUS } from 'react-joyride';
import { toggleSidebar, openSidebar, closeSidebar, changeActiveSidebarItem } from '../../actions/navigation';

import adminDefault from '../../images/chat/chat2.png';
import Exchange from '../../images/sidebar/basil/Exchange';
import Cross from '../../images/sidebar/basil/Cross';
import Settings from '../../images/sidebar/basil/Settings';
import Search from '../../images/sidebar/basil/Search';
import UserDefault from '../../images/sidebar/basil/UserDefault';
import EnvelopeBlack from '../../images/sidebar/basil/EnvelopeBlack';
import PowerButton from '../../images/sidebar/basil/PowerButton';
import CalendarIcon from '../../images/sidebar/Outline/Calendar';

import s from './Header.module.scss';

class Header extends React.Component {
  static propTypes = {
    sidebarOpened: PropTypes.bool.isRequired,
    sidebarStatic: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.switchSidebar = this.switchSidebar.bind(this);
    this.toggleNotifications = this.toggleNotifications.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.doLogout = this.doLogout.bind(this);
    this.fetchNotifications = this.fetchNotifications.bind(this);
    this.markAsRead = this.markAsRead.bind(this);

    this.state = {
      menuOpen: false,
      notificationsOpen: false,
      notifications: [],
      notificationsTabSelected: 1,
      focus: false,
      showNewMessage: false,
      hideMessage: true,
      run: false,
      steps: [
        {
          content: 'You can adjust sidebar, or leave it closed 😃',
          placement: 'bottom',
          target: '#toggleSidebar',
          textAlign: 'center',
          disableBeacon: true
        },
        {
          content: "Admin can check out his messages and tasks easily 😃",
          placement: 'bottom',
          target: '.dropdown-toggle',
        },
        {
          content: "Clickable cog can provide you with link to important pages 😄",
          placement: 'bottom',
          target: '.tutorial-dropdown',
        },
        {
          content: 'Open theme cusomizer sidebar, play with it or watch tour! ❤️',
          placement: 'left',
          target: '.helper-button'
        },
      ],
    };
  }

  componentDidMount() {
    if (window.location.href.includes('main')) {
      this.setState({ run: true })
    }
    // Temporarily disable notifications polling to debug infinite loop
    // this.fetchNotifications();
    // this.notificationInterval = setInterval(this.fetchNotifications, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.notificationInterval);
  }

  async fetchNotifications() {
    // Check if token exists and is valid before making API call
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token available for notifications');
      return;
    }
    
    try {
      // Quick token validation to prevent expired token errors
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token expired, skipping notifications fetch');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }
      
      const res = await api.getNotifications();
      // Only update state if component is still mounted
      if (this.notificationInterval) {
        this.setState({ notifications: res.data });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // If authentication error, clear token to prevent repeated failures
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      // Don't update state on error to prevent infinite loops
    }
  }

  async markAsRead(notificationId) {
    try {
      await api.markAsRead(notificationId);
      this.fetchNotifications(); // Refresh notifications after marking one as read
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // handleJoyrideCallback = (CallBackProps) => {
  //   const { status } = CallBackProps;
  //
  //   if (([STATUS.FINISHED, STATUS.SKIPPED]).includes(status)) {
  //     this.setState({ run: false });
  //   }
  //
  // };

  start = () => {
    this.setState({
      run: true,
    });
  };

  toggleFocus = () => {
    this.setState({ focus: !this.state.focus })
  }

  toggleNotifications() {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  }

  doLogout() {
    this.props.dispatch(logoutUser());
  }

  // collapse/uncolappse
  switchSidebar() {
    if (this.props.sidebarOpened) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      const paths = this.props.location.pathname.split('/');
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join('/')));
    }
  }

  // static/non-static
  toggleSidebar() {
    this.props.dispatch(toggleSidebar());
    if (this.props.sidebarStatic) {
      localStorage.setItem('staticSidebar', 'false');
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      localStorage.setItem('staticSidebar', 'true');
      const paths = this.props.location.pathname.split('/');
      paths.pop();
      this.props.dispatch(changeActiveSidebarItem(paths.join('/')));
    }
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }
  render() {
    const { focus } = this.state;
    const { openUsersList } = this.props;
    const navbarType = localStorage.getItem("navbarType") || 'static'

    const user = this.props.currentUser;
    const avatar = user && user.avatar && user.avatar.length && user.avatar[0].publicUrl;

    const firstUserLetter = user && (user.firstName|| user.email)[0].toUpperCase();

    return (
      <Navbar className={`${s.root} d-print-none ${navbarType === NavbarTypes.FLOATING ? s.navbarFloatingType : ''}`}  style={{zIndex: !openUsersList ? 100 : 0}}>
        {/*<Joyride*/}
        {/*  callback={this.handleJoyrideCallback}*/}
        {/*  continuous={true}*/}
        {/*  run={this.state.run}*/}
        {/*  showSkipButton={true}*/}
        {/*  steps={this.state.steps}*/}
        {/*  spotlightPadding={-10}*/}
        {/*  disableOverlay={true}*/}
        {/*  disableScrolling*/}
        {/*  styles={{*/}
        {/*    options: {*/}
        {/*      arrowColor: '#ffffff',*/}
        {/*      backgroundColor: '#ffffff',*/}
        {/*      overlayColor: 'rgba(79, 26, 0, 0.4)',*/}
        {/*      primaryColor: '#000',*/}
        {/*      textColor: '#495057',*/}
        {/*      spotlightPadding: 0,*/}
        {/*      zIndex: 1000,*/}
        {/*      padding: 5,*/}
        {/*      width: 240,*/}
        {/*    },*/}
        {/*    tooltip: {*/}
        {/*      fontSize: 15,*/}
        {/*      padding: 15,*/}
        {/*    },*/}
        {/*    tooltipContent: {*/}
        {/*      padding: '20px 5px 0',*/}
        {/*    },*/}
        {/*    floater: {*/}
        {/*      arrow: {*/}
        {/*        padding: 10*/}
        {/*      },*/}
        {/*    },*/}
        {/*    buttonClose: {*/}
        {/*      display: 'none'*/}
        {/*    },*/}
        {/*    buttonNext: {*/}
        {/*      backgroundColor: "#21AE8C",*/}
        {/*      fontSize: 13,*/}
        {/*      borderRadius: 4,*/}
        {/*      color: "#ffffff",*/}
        {/*      fontWeight: "bold",*/}
        {/*      outline: "none"*/}
        {/*    },*/}
        {/*    buttonBack: {*/}
        {/*      color: "#798892",*/}
        {/*      marginLeft: 'auto',*/}
        {/*      fontSize: 13,*/}
        {/*      marginRight: 5,*/}
        {/*    },*/}
        {/*    buttonSkip: {*/}
        {/*      color: "#798892",*/}
        {/*      fontSize: 13,*/}
        {/*    },*/}
        {/*  }}*/}
        {/*/>*/}
        <div className="d-flex flex-row justify-content-md-start flex-grow-1 align-content-center align-self-start">
          <Nav className="my-auto">
            {/* Sidebar toggle removed for permanent expansion */}
            <NavItem className="d-sm-down-none">
              <NavLink className="px-2">
              <span className={s.headerSvgFlipColor}>
                <Exchange/>
              </span>
              </NavLink>
            </NavItem>
            <NavItem className="d-sm-down-none">
              <NavLink className="px-2">
              <span className={s.headerSvgFlipColor}>
                <Cross />
              </span>
              </NavLink>
            </NavItem>
          </Nav>

          <Form className={`${s.headerSearchInput} d-sm-down-none`} inline>
            <FormGroup>
              <InputGroup onFocus={this.toggleFocus} onBlur={this.toggleFocus} className={
                cx('input-group-no-border', {'focus' : !!focus})
              }>

                  <div className={`${s.headerSvgFlipColor} input-group-prepend-icon`}><Search /></div>
                  <Input id="search-input" placeholder="Search Dashboard" className={cx({'focus' : !!focus})} />
              </InputGroup>
            </FormGroup>
          </Form>

          <Nav className="my-auto">
            <NavItem className="d-sm-down-none">
              <NavLink href="#/provider/register">For Providers</NavLink>
            </NavItem>
          </Nav>

          <NavLink className={`${s.navbarBrand} d-md-none ${s.headerSvgFlipColor}`}>
            <i className="fa fa-circle text-primary me-n-sm" />
            <i className="fa fa-circle text-danger" />
            &nbsp;
            sing
            &nbsp;
            <i className="fa fa-circle text-danger me-n-sm" />
            <i className="fa fa-circle text-primary" />
          </NavLink>
        </div>

        <div>
          <Nav className="ms-auto">
            <Dropdown nav isOpen={this.state.notificationsOpen} toggle={this.toggleNotifications} id="basic-nav-dropdown" className={`${s.notificationsMenu}`}>
              <DropdownToggle nav caret className={s.headerSvgFlipColor}>
            <span className={`${s.avatar} rounded-circle float-start me-3`}>
              {avatar ? (
                  <img src={avatar} onError={e => e.target.src = adminDefault} alt="..." title={user && (user.firstName || user.email)} />
              ) : user && user.role === 'admin' ? (
                  <img src={adminDefault} onError={e => e.target.src = adminDefault} alt="..." title={user && (user.firstName || user.email)} />
              ) : <span title={user && (user.firstName || user.email)}>{firstUserLetter}</span>
              }
            </span>
                <span className={`small m-2 d-sm-down-none ${s.headerTitle} ${this.props.sidebarStatic ? s.adminEmail : ''}`}>{user ? (user.firstName || user.email) : "Philip smith"}</span>
                {this.state.notifications.length > 0 &&
                  <span className="m-1 circle bg-light-red text-white fw-semi-bold d-sm-down-none">{this.state.notifications.length}</span>
                }
              </DropdownToggle>
              <DropdownMenu end className={`${s.notificationsWrapper} py-0 animated animated-fast fadeInUp`}>
                <Notifications
                  notifications={this.state.notifications}
                  markAsRead={this.markAsRead}
                />
              </DropdownMenu>
            </Dropdown>
            <Dropdown nav isOpen={this.state.menuOpen} toggle={this.toggleMenu} className="tutorial-dropdown pr-4">
              <DropdownToggle nav className={`${s.mobileCog}`}>
              <span className={`${s.headerSvgFlipColor}`}>
                <Settings/>
              </span>
              </DropdownToggle>
              <DropdownMenu end className={`${s.headerDropdownLinks} super-colors`}>
                <DropdownItem href="http://demo-flatlogic2.herokuapp.com/sing-app-react/#/app/profile"><span className={s.headerDropdownIcon}><UserDefault/></span> My Account</DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="http://demo-flatlogic2.herokuapp.com/sing-app-react/#/app/extra/calendar"><span className={s.headerDropdownIcon}><CalendarIcon/></span>Calendar</DropdownItem>
                <DropdownItem href="http://demo-flatlogic2.herokuapp.com/sing-app-react/#/app/inbox"><span className={s.headerDropdownIcon}><EnvelopeBlack/></span>Inbox &nbsp;&nbsp;</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={this.doLogout}><span className={s.headerDropdownIcon}><PowerButton/></span> Log Out</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </div>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    navbarType: store.layout.navbarType,
    navbarColor: store.layout.navbarColor,
    openUsersList: store.chat.openUsersList,
    currentUser: store.auth.currentUser,
  };
}

export default withRouter(connect(mapStateToProps)(Header));

