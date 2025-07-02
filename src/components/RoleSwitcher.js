import React from 'react';
import users from '../mockUsers';

const roleLabels = {
  admin: 'Admin',
  lab: 'Lab',
  worker: 'Worker',
  provider: 'Provider',
};

const RoleSwitcher = ({ currentUser, onSwitch }) => {
  return (
    <div style={{ padding: '1rem', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
      <label htmlFor="role-switcher" style={{ fontWeight: 'bold', marginRight: 8 }}>Switch User Role:</label>
      <select
        id="role-switcher"
        value={currentUser?.email || ''}
        onChange={e => {
          const selected = users.find(u => u.email === e.target.value);
          if (selected) onSwitch(selected);
        }}
      >
        {users.map(user => (
          <option key={user.id} value={user.email}>
            {roleLabels[user.role] || user.role}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleSwitcher;
