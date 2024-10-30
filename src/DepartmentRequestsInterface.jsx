import React, { useState, useEffect } from 'react';
import { Clock, Filter, PlusCircle, CheckCircle } from 'lucide-react';

const requestTypes = {
    'Live Jobs': [
        'Tool Requisition Processing',
        'Field Emergency Response',
        'Inspection Scheduling',
        'ILI Data Review',
        'DAR (Data Acquisition Report) Management',
        'IMU Data Correction',
        'Quality Assurance and Defect Assessment',
        'Equipment Calibration',
        'Engineering and Production Support',
        'Data Quality Management'
    ],
    'Information Requests': [
        'Tool Availability Inquiry',
        'Personnel Availability Check',
        'Pigging Reference Information',
        'ILI Methodology Consultation',
        'ESF Growth Analysis Inquiry',
        'Inspection Cost Estimation',
        'Labor Hours Estimation',
        'Project Resource Allocation Inquiry',
        'Project History Retrieval',
        'Client Presentation Preparation',
        'ILI Project Budget Draft (Bidding Phase)'
    ],
    'Development Jobs': [
        'R&D Testing Initiatives',
        'Software Feature Enhancement',
        'Technical Specification Development'
    ],
    'Administrative Tasks': []
};

const statusOptions = [
    'New',
    'In Progress',
    'Waiting for Input',
    'In Review',
    'On Hold',
    'Completed',
    'Cancelled'
];

const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

const RequestSubmissionPage = ({ onSubmit }) => {
    const [request, setRequest] = useState({
        category: '',
        name: '',
        requester: '',
        description: '',
        priority: 'Medium'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequest(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(request);
        setRequest({ category: '', name: '', requester: '', description: '', priority: 'Medium' });
    };

    return (
        <div className="card shadow">
            <div className="card-header bg-white">
                <div className="d-flex align-items-center gap-2">
                    <PlusCircle className="text-primary" />
                    <h2 className="h4 mb-0">Submit New Request</h2>
                </div>
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Category</label>
                            <select
                                name="category"
                                value={request.category}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="">Select a category</option>
                                {Object.keys(requestTypes).map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Request Name</label>
                            <select
                                name="name"
                                value={request.name}
                                onChange={handleChange}
                                className="form-select"
                                required
                                disabled={!request.category}
                            >
                                <option value="">Select a request type</option>
                                {request.category && requestTypes[request.category].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Requester</label>
                            <input
                                type="text"
                                name="requester"
                                value={request.requester}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Priority</label>
                            <select
                                name="priority"
                                value={request.priority}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                {priorityOptions.map(priority => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                value={request.description}
                                onChange={handleChange}
                                className="form-control"
                                rows="4"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                        <CheckCircle size={20} />
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

const DepartmentRequestsInterface = () => {
    const [requests, setRequests] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentPage, setCurrentPage] = useState('submit');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleStatusChange = (id, newStatus) => {
        setRequests(prevRequests => prevRequests.map(req =>
            req.id === id ? { ...req, status: newStatus } : req
        ));
    };

    const handlePriorityChange = (id, newPriority) => {
        setRequests(prevRequests => prevRequests.map(req =>
            req.id === id ? { ...req, priority: newPriority } : req
        ));
    };

    const getStatusColor = (status) => {
        const colors = {
            'New': 'bg-info bg-opacity-10 text-info',
            'In Progress': 'bg-warning bg-opacity-10 text-warning',
            'Waiting for Input': 'bg-secondary bg-opacity-10 text-secondary',
            'In Review': 'bg-primary bg-opacity-10 text-primary',
            'On Hold': 'bg-danger bg-opacity-10 text-danger',
            'Completed': 'bg-success bg-opacity-10 text-success',
            'Cancelled': 'bg-danger bg-opacity-10 text-danger'
        };
        return colors[status] || 'bg-secondary bg-opacity-10 text-secondary';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Low': 'bg-success bg-opacity-10 text-success',
            'Medium': 'bg-warning bg-opacity-10 text-warning',
            'High': 'bg-danger bg-opacity-10 text-danger',
            'Urgent': 'bg-danger bg-opacity-10 text-danger'
        };
        return colors[priority] || 'bg-secondary bg-opacity-10 text-secondary';
    };

    const calculateTimePassed = (requestDate) => {
        const diff = currentTime - new Date(requestDate);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${days}d ${hours}h ${minutes}m`;
    };

    const handleNewRequest = (newRequest) => {
        const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
        const fullRequest = {
            ...newRequest,
            id: newId,
            status: 'New',
            requestDate: new Date().toISOString()
        };
        setRequests(prevRequests => [...prevRequests, fullRequest]);
        setCurrentPage('track');
    };

    return (
        <div className="min-vh-100 bg-light py-4">
            <div className="container-fluid px-4">
                <div className="text-center mb-4">
                    <h1 className="display-5 mb-3">Department Requests Manager</h1>
                    <div className="d-flex align-items-center justify-content-center gap-2 text-muted">
                        <Clock size={20} />
                        <span>{currentTime.toLocaleString()}</span>
                    </div>
                </div>

                <div className="d-flex justify-content-center gap-2 mb-4">
                    <button
                        onClick={() => setCurrentPage('submit')}
                        className={`btn ${currentPage === 'submit' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                        Submit Request
                    </button>
                    <button
                        onClick={() => setCurrentPage('track')}
                        className={`btn ${currentPage === 'track' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                        Track Requests
                    </button>
                </div>

                {currentPage === 'submit' ? (
                    <RequestSubmissionPage onSubmit={handleNewRequest} />
                ) : (
                    <div className="card shadow">
                        <div className="card-header bg-white">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                    <Filter className="text-primary" />
                                    <h2 className="h4 mb-0">Request Database</h2>
                                </div>
                                <span className="text-muted">{requests.length} requests</span>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        {['Category', 'Request Name', 'Priority', 'Status', 'Requester', 'Request Date', 'Time Passed'].map((header) => (
                                            <th key={header} className="px-3">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request) => (
                                        <tr key={request.id}>
                                            <td className="px-3">{request.category}</td>
                                            <td className="px-3 fw-medium">{request.name}</td>
                                            <td className="px-3">
                                                <select
                                                    value={request.priority}
                                                    onChange={(e) => handlePriorityChange(request.id, e.target.value)}
                                                    className={`form-select form-select-sm ${getPriorityColor(request.priority)}`}
                                                >
                                                    {priorityOptions.map(priority => (
                                                        <option key={priority} value={priority}>{priority}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-3">
                                                <select
                                                    value={request.status}
                                                    onChange={(e) => handleStatusChange(request.id, e.target.value)}
                                                    className={`form-select form-select-sm ${getStatusColor(request.status)}`}
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-3">{request.requester}</td>
                                            <td className="px-3">{new Date(request.requestDate).toLocaleString()}</td>
                                            <td className="px-3">{calculateTimePassed(request.requestDate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentRequestsInterface;