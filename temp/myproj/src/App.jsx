//import React, { useState } from 'react';
//import { JSONTree } from 'react-json-tree';

//const App = () => {
//  const [file, setFile]       = useState(null);
//  const [jsonData, setJsonData] = useState(null);
//  const [loading, setLoading] = useState(false);
//  const [error, setError]     = useState(null);

//  const handleFileChange = (e) => {
//    setFile(e.target.files[0]);
//    setJsonData(null);
//    setError(null);
//  };

//  const handleUpload = async () => {
//    if (!file) return;
//    setLoading(true);
//    const form = new FormData();
//    form.append('xsdFile', file);

//    try {
//      const res = await fetch('http://localhost:3001/upload', {
//        method: 'POST',
//        body: form
//      });
//      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
//      await res.json();  
//      const schemaRes = await fetch('http://localhost:3001/schema.json');
//      if (!schemaRes.ok) throw new Error(`Schema fetch failed: ${schemaRes.statusText}`);
//      const data = await schemaRes.json();
//      setJsonData(data);
//    } catch (err) {
//      console.error(err);
//      setError(err.message);
//    } finally {
//      setLoading(false);
//    }
//  };

//  return (
//    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
//      <h1>XSD → JSON Schema Viewer</h1>

//      <div style={{ marginBottom: 20 }}>
//        <input type="file" accept=".xsd" onChange={handleFileChange} />
//        <button 
//          onClick={handleUpload} 
//          disabled={!file || loading}
//          style={{ marginLeft: 10 }}
//        >
//          {loading ? 'Converting…' : 'Upload & Convert'}
//        </button>
//      </div>

//      {error && (
//        <p style={{ color: 'red' }}>Error: {error}</p>
//      )}

//      {jsonData && (
//        <>
//          <h2>Resulting JSON Schema</h2>
//          <JSONTree data={jsonData} />
//        </>
//      )}
//    </div>
//  );
//};

//export default App;
import React, { useState } from 'react';
import { JSONTree } from 'react-json-tree';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const PanelHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 p-4 bg-slate-50 border-b border-slate-200">
    <Icon className="w-5 h-5 text-slate-600" />
    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
  </div>
);

const FileUploadSection = ({ file, onFileChange, onUpload, loading, error, success }) => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="file"
          accept=".xsd"
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id={`file-${Math.random()}`}
        />
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
          <Upload className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-600">
            {file ? file.name : 'Choose XSD file'}
          </span>
        </div>
      </div>
      
      <button
        onClick={onUpload}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Converting...
          </>
        ) : (
          'Convert'
        )}
      </button>
    </div>

    {error && (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
        <span className="text-sm text-red-700">{error}</span>
      </div>
    )}

    {success && !error && (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
        <span className="text-sm text-green-700">Conversion completed successfully</span>
      </div>
    )}
  </div>
);

const JsonTreeSection = ({ jsonData, loading }) => (
  <div className="flex-1 overflow-auto">
    {loading ? (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-600">Processing XSD...</span>
        </div>
      </div>
    ) : jsonData ? (
      <div className="p-4">
        <JSONTree 
          data={jsonData}
          theme={{
            scheme: 'monokai',
            base00: '#ffffff',
            base01: '#f8f9fa',
            base02: '#e9ecef',
            base03: '#dee2e6',
            base04: '#6c757d',
            base05: '#495057',
            base06: '#343a40',
            base07: '#212529',
            base08: '#dc3545',
            base09: '#fd7e14',
            base0A: '#ffc107',
            base0B: '#28a745',
            base0C: '#17a2b8',
            base0D: '#007bff',
            base0E: '#6f42c1',
            base0F: '#e83e8c'
          }}
          invertTheme={false}
          hideRoot={false}
          shouldExpandNode={() => false}
        />
      </div>
    ) : (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>Upload an XSD file to see the JSON schema</p>
        </div>
      </div>
    )}
  </div>
);

const Panel = ({ title, icon, file, jsonData, loading, error, onFileChange, onUpload }) => (
  <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200">
    <PanelHeader title={title} icon={icon} />
    <FileUploadSection
      file={file}
      onFileChange={onFileChange}
      onUpload={onUpload}
      loading={loading}
      error={error}
      success={jsonData !== null}
    />
    <JsonTreeSection jsonData={jsonData} loading={loading} />
  </div>
);

const App = () => {
  // Source panel state
  const [sourceFile, setSourceFile] = useState(null);
  const [sourceJsonData, setSourceJsonData] = useState(null);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourceError, setSourceError] = useState(null);

  // Target panel state
  const [targetFile, setTargetFile] = useState(null);
  const [targetJsonData, setTargetJsonData] = useState(null);
  const [targetLoading, setTargetLoading] = useState(false);
  const [targetError, setTargetError] = useState(null);

  const handleFileChange = (setter, setJsonData, setError) => (e) => {
    setter(e.target.files[0]);
    setJsonData(null);
    setError(null);
  };

  const handleUpload = (file, setLoading, setJsonData, setError) => async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    const form = new FormData();
    form.append('xsdFile', file);

    try {
      const res = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: form
      });
      
      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      await res.json();

      const schemaRes = await fetch('http://localhost:3001/schema.json');
      if (!schemaRes.ok) throw new Error(`Schema fetch failed: ${schemaRes.statusText}`);
      
      const data = await schemaRes.json();
      setJsonData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">
            XSD to JSON Schema Converter
          </h1>
          <p className="text-slate-600 mt-1">
            Compare source and target XSD schemas side by side
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Source Panel */}
          <Panel
            title="Source XSD"
            icon={FileText}
            file={sourceFile}
            jsonData={sourceJsonData}
            loading={sourceLoading}
            error={sourceError}
            onFileChange={handleFileChange(setSourceFile, setSourceJsonData, setSourceError)}
            onUpload={handleUpload(sourceFile, setSourceLoading, setSourceJsonData, setSourceError)}
          />

          {/* Target Panel */}
          <Panel
            title="Target XSD"
            icon={FileText}
            file={targetFile}
            jsonData={targetJsonData}
            loading={targetLoading}
            error={targetError}
            onFileChange={handleFileChange(setTargetFile, setTargetJsonData, setTargetError)}
            onUpload={handleUpload(targetFile, setTargetLoading, setTargetJsonData, setTargetError)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;