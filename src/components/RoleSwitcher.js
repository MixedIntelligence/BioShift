import React, { useState, useCallback } from 'react';
import users from '../mockUsers';

const roleLabels = {
  admin: 'Admin',
  lab: 'Lab',
  worker: 'Worker',
  provider: 'Provider',
};

/**
 * RoleSwitcher - Admin Development Tool
 * 
 * Allows administrators to quickly switch between different user roles
 * to test UI/UX flows and role-based access control (RBAC).
 * 
 * Only visible to users with admin role.
 * Includes safeguards to prevent infinite loops from rapid state changes.
 */
const RoleSwitcher = ({ currentUser, onSwitch }) => {
  const [isChanging, setIsChanging] = useState(false);
  
  const handleRoleSwitch = useCallback((e) => {
    if (isChanging) return; // Prevent rapid switches
    
    const selectedEmail = e.target.value;
    const selected = users.find(u => u.email === selectedEmail);
    
    if (selected && selected.email !== currentUser?.email) {
      setIsChanging(true);
      // Use setTimeout to prevent synchronous state updates that could cause loops
      setTimeout(() => {
        onSwitch(selected);
        setIsChanging(false);
      }, 0);
    }
  }, [currentUser?.email, onSwitch, isChanging]);

  // Only show for admin users
  if (currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ 
      padding: '1rem', 
      borderBottom: '1px solid #eee', 
      background: '#f8f9fa',
      opacity: isChanging ? 0.7 : 1
    }}>
      <label htmlFor="role-switcher" style={{ fontWeight: 'bold', marginRight: 8 }}>
        🔧 Admin Tool - Switch User Role:
      </label>
      <select
        id="role-switcher"
        value={currentUser?.email || ''}
        onChange={handleRoleSwitch}
        disabled={isChanging}
      >
        {users.map(user => (
          <option key={user.id} value={user.email}>
            {roleLabels[user.role] || user.role} - {user.firstName} {user.lastName}
          </option>
        ))}
      </select>
      {isChanging && <span style={{ marginLeft: '8px', fontSize: '0.8em' }}>Switching...</span>}
    </div>
  );
};

export default RoleSwitcher;
