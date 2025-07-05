import React from 'react';
import PropTypes from 'prop-types';
import './Notifications.css';

const Notifications = ({ notifications, markAsRead }) => {
  return (
    <div className="notifications-container">
      <div className="notifications-dropdown">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.notification_id} className="notification-item" onClick={() => markAsRead(notification.notification_id)}>
              <p>{notification.message}</p>
              <span className="notification-time">{new Date(notification.created_at).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <div className="notification-item">No new notifications</div>
        )}
      </div>
    </div>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  markAsRead: PropTypes.func.isRequired,
};

export default Notifications;
