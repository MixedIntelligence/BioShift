import React from 'react';
import Widget from '../../../components/Widget';
import s from '../../products/Products.module.scss';
import { FaRobot, FaProjectDiagram, FaCertificate, FaComments, FaBalanceScale, FaChartLine, FaUserGraduate, FaPuzzlePiece } from 'react-icons/fa';

const bionics = [
  {
    id: 'bionic-matchmaker',
    icon: <FaProjectDiagram size={28} color="#1976D2" />,
    name: 'Bionics.Matchmaker',
    description: 'Recommends ideal gigs to professionals and talent to labs using adaptive filters and recent certifications.',
    status: 'Active',
    integration: 'Dashboard, Gigs',
    example: '“3 new projects match your GLP certification.”',
  },
  {
    id: 'bionic-credential',
    icon: <FaCertificate size={28} color="#388E3C" />,
    name: 'Bionics.CredentialCopilot',
    description: 'Reviews uploaded certifications, verifies metadata, and suggests relevant gigs unlocked by those certs.',
    status: 'Active',
    integration: 'Profile, Documents',
    example: '“Your new BSL-2 cert unlocks 2 more gigs.”',
  },
  {
    id: 'bionic-messaging',
    icon: <FaComments size={28} color="#7B1FA2" />,
    name: 'Bionics.MessagingAssistant',
    description: 'Suggests clarifying questions, next steps, or file requests in chat based on gig state.',
    status: 'Prototype',
    integration: 'Chat',
    example: '“You haven’t discussed start date yet.”',
  },
  {
    id: 'bionic-offer',
    icon: <FaChartLine size={28} color="#FBC02D" />,
    name: 'Bionics.OfferOptimizer',
    description: 'Recommends optimal contract length, rate, and gig visibility for labs to maximize applicant quality.',
    status: 'Planned',
    integration: 'Gigs, Admin',
    example: '“Increase your rate to $65–$80 for better applicants.”',
  },
  {
    id: 'bionic-health',
    icon: <FaRobot size={28} color="#0288D1" />,
    name: 'Bionics.GigHealthMonitor',
    description: 'Flags high-risk gigs using status, sentiment, and milestone completion.',
    status: 'Planned',
    integration: 'Dashboard, Gigs',
    example: '“This gig is at risk due to low communication.”',
  },
  {
    id: 'bionic-ethics',
    icon: <FaBalanceScale size={28} color="#C62828" />,
    name: 'Bionics.EthicalSentinel',
    description: 'Alerts for IP risk, labor compliance, or misuse of tools/data.',
    status: 'Planned',
    integration: 'Admin, Chat',
    example: '“Add an IP disclosure clause to this project.”',
  },
  {
    id: 'bionic-upskill',
    icon: <FaUserGraduate size={28} color="#009688" />,
    name: 'Bionics.UpskillingRecommender',
    description: 'Identifies gig-gated skills/certs and recommends upskilling providers.',
    status: 'Prototype',
    integration: 'Upskill, Dashboard',
    example: '“Get certified in HPLC to unlock 4 more gigs.”',
  },
  {
    id: 'bionic-plugins',
    icon: <FaPuzzlePiece size={28} color="#607D8B" />,
    name: 'Bionics.PluginReady',
    description: 'Future support for LabLeap plugins (bioinformatics, civic science, etc).',
    status: 'Planned',
    integration: 'Platform',
    example: '“Connect a bioinformatics pipeline plugin.”',
  },
];

const Bionics = () => (
  <div>
    <h2>My LabLeap Bionics</h2>
    <p>
      <strong>LabLeap Bionics</strong> is your intelligent agent layer for BioShift. These agents automate, augment, and guide scientific gig workflows—acting as mixed-intelligence copilots for scientists, labs, admins, and providers.
    </p>
    <Widget title="Bionics Agents & Capabilities" collapse close>
      <table className={`table table-striped ${s.bootstrapTable}`}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Integration</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {bionics.map(item => (
            <tr key={item.id}>
              <td>{item.icon}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.status}</td>
              <td>{item.integration}</td>
              <td><em>{item.example}</em></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
    <Widget title="How Bionics Works" collapse close>
      <ul>
        <li><strong>Project Matching Agent:</strong> Recommends gigs/talent using skills, history, and certs.</li>
        <li><strong>Credential Copilot:</strong> Reviews and verifies uploaded certifications.</li>
        <li><strong>Contextual Messaging Assistant:</strong> Suggests next steps in chat and gig workflows.</li>
        <li><strong>Offer Optimizer:</strong> Recommends contract/rate optimizations for labs.</li>
        <li><strong>Gig Health Monitor:</strong> Flags high-risk gigs using platform signals.</li>
        <li><strong>Ethical & IP Sentinel:</strong> Alerts for compliance and IP risks.</li>
        <li><strong>Upskilling Recommender:</strong> Identifies and suggests skill/cert gaps.</li>
        <li><strong>Plugin-ready:</strong> Future support for custom agent plugins.</li>
      </ul>
    </Widget>
  </div>
);

export default Bionics;
