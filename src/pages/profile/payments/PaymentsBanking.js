import React from 'react';
import mastercard from '../../../images/payments/mastercard.svg';
import visa from '../../../images/payments/visa.svg';
import aexpress from '../../../images/payments/aexpress.svg';
import paypal from '../../../images/payments/paypal.svg';
import cardBg from '../../../images/cards/lifestyle.jpg';
import avatar from '../../../images/people/a1.jpg';
import PaymentMethods from './PaymentMethods';
import Section from '../../product/components/Section/Section';
import s from '../../product/components/Banner/Banner.module.scss';

const mockSummary = [
  { label: 'Current Balance', value: '$2,450.00', color: '#4e54c8' },
  { label: 'Last Payment', value: '$320.00', color: '#43cea2' },
  { label: 'Total Spent', value: '$8,900.00', color: '#ffb347' },
];

const mockTransactions = [
  { id: 1, name: 'Lab Equipment', date: '2025-06-28', amount: '-$1,200.00', method: visa, img: avatar },
  { id: 2, name: 'Consulting Fee', date: '2025-06-25', amount: '+$2,000.00', method: paypal, img: avatar },
  { id: 3, name: 'Reagent Purchase', date: '2025-06-20', amount: '-$350.00', method: mastercard, img: avatar },
  { id: 4, name: 'AI Service', date: '2025-06-15', amount: '-$99.00', method: aexpress, img: avatar },
];

const spendingPercent = 72; // Example for a progress bar visual

const PaymentsBanking = () => (
  <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
    <h2 style={{ marginBottom: 32 }}>Payments & Banking</h2>

    {/* Financial Summary Cards */}
    <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
      {mockSummary.map((item) => (
        <div key={item.label} style={{
          flex: 1,
          background: item.color,
          color: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{item.value}</div>
          <div style={{ opacity: 0.8, fontSize: 16 }}>{item.label}</div>
        </div>
      ))}
    </div>

    {/* Spending Progress Visual */}
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Spending Goal Progress</div>
      <div style={{ height: 18, background: '#f0f0f0', borderRadius: 9, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ width: spendingPercent + '%', background: 'linear-gradient(90deg, #4e54c8, #43cea2)', height: '100%' }} />
      </div>
      <div style={{ fontSize: 14, color: '#888' }}>{spendingPercent}% of monthly budget used</div>
    </div>

    {/* Payment Methods Section */}
    <Section title="Payment Methods">
      <p>Manage your payment cards and connected accounts:</p>
      <div style={{ display: 'flex', gap: 24, margin: '24px 0' }}>
        {[visa, mastercard, aexpress, paypal].map((img, idx) => (
          <div key={idx} style={{
            background: `url(${cardBg}) center/cover no-repeat`,
            borderRadius: 16,
            width: 180,
            height: 110,
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: 16,
          }}>
            <img src={img} alt="method" style={{ width: 48, height: 32, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} />
          </div>
        ))}
      </div>
    </Section>

    {/* Banking Details Section */}
    <Section title="Banking Details">
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <img src={cardBg} alt="bank" style={{ width: 120, height: 80, borderRadius: 12, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Bank of Science</div>
          <div style={{ color: '#888', fontSize: 15 }}>Account ending in 1234</div>
          <div style={{ color: '#888', fontSize: 15 }}>IBAN: DE89 3704 0044 0532 0130 00</div>
          <div style={{ color: '#888', fontSize: 15 }}>Payout: Weekly</div>
        </div>
      </div>
    </Section>

    {/* Transaction History Section */}
    <Section title="Transaction History">
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Recent Transactions</div>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#888', fontSize: 14 }}>
              <th style={{ padding: '8px 0' }}>#</th>
              <th style={{ padding: '8px 0' }}>Name</th>
              <th style={{ padding: '8px 0' }}>Date</th>
              <th style={{ padding: '8px 0' }}>Amount</th>
              <th style={{ padding: '8px 0' }}>Method</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 0' }}>{tx.id}</td>
                <td style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
                  <img src={tx.img} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  {tx.name}
                </td>
                <td style={{ padding: '12px 0' }}>{tx.date}</td>
                <td style={{ padding: '12px 0', color: tx.amount.startsWith('+') ? '#43cea2' : '#e57373', fontWeight: 600 }}>{tx.amount}</td>
                <td style={{ padding: '12px 0' }}><img src={tx.method} alt="method" style={{ width: 32, height: 22 }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  </div>
);

export default PaymentsBanking;
