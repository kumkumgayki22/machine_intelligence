import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Download, Upload, CheckCircle, Clock, AlertTriangle, Search } from 'lucide-react';

export default function WorkOrdersTab({ sensorData }) {
  const [workOrders, setWorkOrders] = useState([
    {
      id: 'WO-8821',
      equipment: 'Turbine Compressor #04',
      fault: 'Bearing Outer-Race Spall',
      severity: 'CRITICAL',
      status: 'In Progress',
      assignedTo: 'Marcus Vance (Senior Mech)',
      createdDate: '2026-09-28 14:30',
      rulHours: 18
    },
    {
      id: 'WO-8819',
      equipment: 'Centrifugal Cooling Pump #12',
      fault: 'Shaft Parallel Misalignment',
      severity: 'WARNING',
      status: 'Scheduled',
      assignedTo: 'Elena Rostova (Reliability Eng)',
      createdDate: '2026-09-27 09:15',
      rulHours: 140
    },
    {
      id: 'WO-8804',
      equipment: 'Robotic Arm Servo Joint #02',
      fault: 'Motor Stator Overheating',
      severity: 'RESOLVED',
      status: 'Closed',
      assignedTo: 'David K. (Elec Tech)',
      createdDate: '2026-09-25 11:00',
      rulHours: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssigned, setNewAssigned] = useState('');

  const handleAddWorkOrder = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newWO = {
      id: `WO-${Math.floor(8822 + Math.random() * 100)}`,
      equipment: 'Turbine Compressor #04',
      fault: newTitle,
      severity: sensorData.status,
      status: 'Pending Dispatch',
      assignedTo: newAssigned || 'Unassigned Tech',
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      rulHours: sensorData.rulHours
    };

    setWorkOrders([newWO, ...workOrders]);
    setNewTitle('');
    setNewAssigned('');
    setShowAddModal(false);
  };

  const exportCSV = () => {
    const headers = 'WO_ID,Equipment,Fault,Severity,Status,AssignedTo,CreatedDate,RUL_Hours\n';
    const rows = workOrders
      .map(
        (w) =>
          `"${w.id}","${w.equipment}","${w.fault}","${w.severity}","${w.status}","${w.assignedTo}","${w.createdDate}",${w.rulHours}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aegismind_work_orders_${Date.now()}.csv`;
    a.click();
  };

  const filteredWO = workOrders.filter(
    (w) =>
      w.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.fault.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileSpreadsheet className="glow-cyan" size={22} style={{ color: 'var(--accent-cyan)' }} />
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600 }}>
              Automated Maintenance Work Orders & History
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              AI-Triggered Maintenance Tickets & ERP Dispatch Integration
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search work orders..."
              style={{ paddingLeft: '30px', fontSize: '0.85rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={exportCSV} className="btn btn-secondary" style={{ padding: '8px 14px' }}>
            <Download size={14} /> Export CSV
          </button>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: '8px 14px' }}>
            <Plus size={14} /> Create Work Order
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px' }}>Work Order ID</th>
              <th style={{ padding: '12px' }}>Equipment Unit</th>
              <th style={{ padding: '12px' }}>Detected AI Fault</th>
              <th style={{ padding: '12px' }}>Severity</th>
              <th style={{ padding: '12px' }}>RUL</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Assigned Technician</th>
              <th style={{ padding: '12px' }}>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredWO.map((wo) => (
              <tr key={wo.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  {wo.id}
                </td>
                <td style={{ padding: '12px' }}>{wo.equipment}</td>
                <td style={{ padding: '12px', fontWeight: 500 }}>{wo.fault}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge ${wo.severity === 'CRITICAL' ? 'badge-danger' : wo.severity === 'WARNING' ? 'badge-warning' : 'badge-success'}`}>
                    {wo.severity}
                  </span>
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{wo.rulHours} hrs</td>
                <td style={{ padding: '12px' }}>{wo.status}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{wo.assignedTo}</td>
                <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{wo.createdDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1rem' }}>
              Create Manual Maintenance Work Order
            </h3>
            <form onSubmit={handleAddWorkOrder}>
              <div className="form-group">
                <label className="form-label">Fault Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Excessive drive-end bearing vibration"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Technician</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. John Doe (Mechanical Specialist)"
                  value={newAssigned}
                  onChange={(e) => setNewAssigned(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
