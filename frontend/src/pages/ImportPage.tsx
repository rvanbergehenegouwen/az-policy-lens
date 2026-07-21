import { useState } from 'react'
import { apiClient } from '../api'
import { Upload } from 'lucide-react'

export const ImportPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMessage('')
    }
  }

  const handleImport = async () => {
    if (!file) {
      setMessage('Please select a file')
      return
    }

    try {
      setLoading(true)
      await apiClient.importPolicies(file)
      setMessage(`Successfully imported ${file.name}`)
      setFile(null)
    } catch (error) {
      setMessage(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '20px' }}>Import Compliance Data</h2>

      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        textAlign: 'center',
        border: '2px dashed var(--border-color)',
        marginBottom: '20px',
      }}>
        <Upload size={48} style={{ margin: '0 auto 16px', color: 'var(--text-secondary)' }} />
        <h3>Upload CSV File</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Select a policy compliance CSV file to import
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ marginTop: '16px' }}
        />
        {file && (
          <p style={{ color: '#28a745', marginTop: '12px' }}>
            ✓ Selected: {file.name}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleImport}
          disabled={!file || loading}
          className="button-primary"
          style={{
            opacity: !file || loading ? 0.5 : 1,
            cursor: !file || loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Importing...' : 'Import'}
        </button>
      </div>

      {message && (
        <p style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '4px',
          backgroundColor: message.includes('failed') ? '#f8d7da' : '#d4edda',
          color: message.includes('failed') ? '#721c24' : '#155724',
        }}>
          {message}
        </p>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
        <h3>Expected CSV Format</h3>
        <code style={{ display: 'block', overflow: 'auto', padding: '12px', backgroundColor: 'white', borderRadius: '4px' }}>
{`policy_id,display_name,category,status,compliance_count,non_compliance_count,framework,scope,assigned_by,created_on
abc123,Allowed VM Sizes,Infrastructure,compliant,45,5,Custom,/subscriptions/xxx,...`}
        </code>
      </div>
    </div>
  )
}
