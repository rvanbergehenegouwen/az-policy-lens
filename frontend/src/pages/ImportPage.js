import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { apiClient } from '../api';
import { Upload } from 'lucide-react';
export const ImportPage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setMessage('');
        }
    };
    const handleImport = async () => {
        if (!file) {
            setMessage('Please select a file');
            return;
        }
        try {
            setLoading(true);
            await apiClient.importPolicies(file);
            setMessage(`Successfully imported ${file.name}`);
            setFile(null);
        }
        catch (error) {
            setMessage(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { style: { padding: '20px', maxWidth: '800px' }, children: [_jsx("h2", { style: { marginBottom: '20px' }, children: "Import Compliance Data" }), _jsxs("div", { style: {
                    background: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '2px dashed var(--border-color)',
                    marginBottom: '20px',
                }, children: [_jsx(Upload, { size: 48, style: { margin: '0 auto 16px', color: 'var(--text-secondary)' } }), _jsx("h3", { children: "Upload CSV File" }), _jsx("p", { style: { color: 'var(--text-secondary)' }, children: "Select a policy compliance CSV file to import" }), _jsx("input", { type: "file", accept: ".csv", onChange: handleFileChange, style: { marginTop: '16px' } }), file && (_jsxs("p", { style: { color: '#28a745', marginTop: '12px' }, children: ["\u2713 Selected: ", file.name] }))] }), _jsx("div", { style: { display: 'flex', gap: '8px' }, children: _jsx("button", { onClick: handleImport, disabled: !file || loading, className: "button-primary", style: {
                        opacity: !file || loading ? 0.5 : 1,
                        cursor: !file || loading ? 'not-allowed' : 'pointer',
                    }, children: loading ? 'Importing...' : 'Import' }) }), message && (_jsx("p", { style: {
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '4px',
                    backgroundColor: message.includes('failed') ? '#f8d7da' : '#d4edda',
                    color: message.includes('failed') ? '#721c24' : '#155724',
                }, children: message })), _jsxs("div", { style: { marginTop: '40px', padding: '20px', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }, children: [_jsx("h3", { children: "Expected CSV Format" }), _jsx("code", { style: { display: 'block', overflow: 'auto', padding: '12px', backgroundColor: 'white', borderRadius: '4px' }, children: `policy_id,display_name,category,status,compliance_count,non_compliance_count,framework,scope,assigned_by,created_on
abc123,Allowed VM Sizes,Infrastructure,compliant,45,5,Custom,/subscriptions/xxx,...` })] })] }));
};
