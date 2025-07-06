import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { 
  Dropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem,
  Badge,
  Button
} from 'reactstrap';
import { toast } from 'react-toastify';
import api from '../../services/api';

const NotificationCenter = ({ currentUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.getNotifications();
      const notifs = response.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // For now, mark all notifications individually since we don't have a batch endpoint
      for (const notification of notifications.filter(n => !n.read)) {
        await api.markAsRead(notification.id);
      }
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      application_received: 'fa-user-plus',
      application_accepted: 'fa-check-circle',
      application_rejected: 'fa-times-circle',
      gig_posted: 'fa-briefcase',
      message_received: 'fa-envelope',
      payment_received: 'fa-dollar-sign',
      profile_viewed: 'fa-eye',
      system: 'fa-info-circle'
    };
    return iconMap[type] || 'fa-bell';
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      application_received: 'text-info',
      application_accepted: 'text-success',
      application_rejected: 'text-danger',
      gig_posted: 'text-primary',
      message_received: 'text-warning',
      payment_received: 'text-success',
      profile_viewed: 'text-muted',
      system: 'text-info'
    };
    return colorMap[type] || 'text-muted';
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="notification-dropdown">
      <DropdownToggle 
        tag="a" 
        className="nav-link position-relative text-decoration-none"
        style={{ cursor: 'pointer' }}
      >
        <i className="fa fa-bell fa-lg"></i>
        {unreadCount > 0 && (
          <Badge 
            color="danger" 
            pill 
            className="position-absolute"
            style={{ 
              top: '-8px', 
              right: '-8px', 
              fontSize: '0.7rem',
              minWidth: '18px',
              height: '18px'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </DropdownToggle>

      <DropdownMenu 
        right 
        className="notification-menu shadow-lg"
        style={{ width: '350px', maxHeight: '400px', overflowY: 'auto' }}
      >
        <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Notifications</h6>
          {unreadCount > 0 && (
            <Button 
              size="sm" 
              color="link" 
              className="p-0 text-muted"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="fa fa-bell-slash fa-2x mb-2"></i>
            <p className="mb-0">No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications.slice(0, 10).map((notification) => (
              <DropdownItem 
                key={notification.id}
                className={`px-3 py-2 border-0 ${!notification.read ? 'bg-light' : ''}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
                style={{ cursor: 'pointer', whiteSpace: 'normal' }}
              >
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-2">
                    <i 
                      className={`fa ${getNotificationIcon(notification.type)} ${getNotificationColor(notification.type)}`}
                    ></i>
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <div className="fw-bold small text-truncate">
                      {notification.title}
                    </div>
                    <div className="text-muted small">
                      {notification.message}
                    </div>
                    <div className="text-muted small">
                      {formatTimeAgo(notification.created_at)}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <div 
                        className="bg-primary rounded-circle"
                        style={{ width: '8px', height: '8px' }}
                      ></div>
                    </div>
                  )}
                </div>
              </DropdownItem>
            ))}
            
            {notifications.length > 10 && (
              <DropdownItem className="text-center border-top">
                <Button color="link" size="sm" className="text-muted">
                  View all notifications
                </Button>
              </DropdownItem>
            )}
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser
});

export default connect(mapStateToProps)(NotificationCenter);
