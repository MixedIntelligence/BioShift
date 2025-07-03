import React from 'react';
import Widget from '../../components/Widget';
import { FaGoogleDrive, FaDropbox, FaFileAlt, FaRobot, FaCloud, FaGithub, FaDiscord, FaSteam, FaSlack, FaTrello, FaSalesforce, FaJira } from 'react-icons/fa';
import { SiRevoltdotchat } from 'react-icons/si';
import s from '../products/Products.module.scss';

const integrations = [
  {
    id: 'gdrive',
    icon: <FaGoogleDrive size={32} color="#4285F4" />,
    name: 'Google Drive',
    description: 'Connect your Google Drive to sync documents, resumes, SOPs, and more.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'dropbox',
    icon: <FaDropbox size={32} color="#0061FF" />,
    name: 'Dropbox',
    description: 'Sync files and manage cloud storage for your lab documents.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'mcp',
    icon: <FaCloud size={32} color="#00B8D9" />,
    name: 'Model Context Protocol (MCP)',
    description: 'Integrate with MCP for secure data and workflow automation.',
    status: 'Available',
    action: 'Configure',
  },
  {
    id: 'ai',
    icon: <FaRobot size={32} color="#7B1FA2" />,
    name: 'AI/LLM Integration',
    description: 'Connect to AI/LLM services for document generation, analysis, and more.',
    status: 'Available',
    action: 'Configure',
  },
  {
    id: 'resume',
    icon: <FaFileAlt size={32} color="#607D8B" />,
    name: 'Resume/CV Builder',
    description: 'Import, build, or update your resume and cover letters.',
    status: 'Available',
    action: 'Open',
  },
  {
    id: 'sop',
    icon: <FaFileAlt size={32} color="#009688" />,
    name: 'SOP & Tax Docs',
    description: 'Manage SOPs, tax documents, and compliance files.',
    status: 'Available',
    action: 'Open',
  },
  {
    id: 'github',
    icon: <FaGithub size={32} color="#333" />,
    name: 'GitHub',
    description: 'Connect your GitHub account for code, issues, and workflow integration.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'steam',
    icon: <FaSteam size={32} color="#171A21" />,
    name: 'Steam',
    description: 'Link your Steam account for science games and simulation tools.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'discord',
    icon: <FaDiscord size={32} color="#7289DA" />,
    name: 'Discord',
    description: 'Join the BioShift Discord for community and support.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'revolt',
    icon: <FaCloud size={32} color="#5A5AFF" />,
    name: 'Revolt',
    description: 'Connect to Revolt for alternative chat and collaboration.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'slack',
    icon: <FaSlack size={32} color="#4A154B" />,
    name: 'Slack',
    description: 'Integrate with Slack for team messaging and notifications.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'trello',
    icon: <FaTrello size={32} color="#0079BF" />,
    name: 'Trello',
    description: 'Connect your Trello boards for project and task management.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'salesforce',
    icon: <FaSalesforce size={32} color="#00A1E0" />,
    name: 'Salesforce',
    description: 'Integrate Salesforce for CRM and sales automation.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'jira',
    icon: <FaJira size={32} color="#0052CC" />,
    name: 'JIRA',
    description: 'Connect to JIRA for issue tracking and agile project management.',
    status: 'Not Connected',
    action: 'Connect',
  },
];

const Connect = () => (
  <div>
    <h2>BioShift Connect</h2>
    <p>Connect your BioShift account to external platforms, APIs, and productivity tools.</p>
    <Widget title="Available Integrations" collapse close>
      <div className={s.productsListElements}>
        {integrations.map(item => (
          <div key={item.id} className={s.productCard} style={{width: 340, display: 'inline-block', margin: 12, verticalAlign: 'top'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: 16}}>
              {item.icon}
              <div>
                <div className={s.productsCardTitle}>{item.name}</div>
                <div className={s.productsCardSubtitle}>{item.status}</div>
              </div>
            </div>
            <div className={s.productsCardDescription} style={{padding: '0 16px 16px'}}>{item.description}</div>
            <div style={{padding: '0 16px 16px'}}>
              <button className="btn btn-primary btn-sm">{item.action}</button>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  </div>
);

export default Connect;
