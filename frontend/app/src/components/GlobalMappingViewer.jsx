import React, { useState } from 'react';
import {
  X,
  Copy,
  Download,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Trash2,
} from 'lucide-react';

const GlobalMappingViewer = ({ mappings, onClose, onDeleteMapping }) => {
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted' or 'json'
  const [expandedMappings, setExpandedMappings] = useState(new Set());
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { index, id, name }

  const toggleExpanded = (mappingId) => {
    const newExpanded = new Set(expandedMappings);
    if (newExpanded.has(mappingId)) {
      newExpanded.delete(mappingId);
    } else {
      newExpanded.add(mappingId);
    }
    setExpandedMappings(newExpanded);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // optionally show a toast here
      console.log('Copied to clipboard');
    });
  };

  const downloadMappings = () => {
    const dataStr = JSON.stringify(mappings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const filename = `xsd-mappings-${new Date().toISOString().split('T')[0]}.json`;

    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    link.click();
  };

  const handleDeleteMapping = (mappingIndex, mappingId, mappingName) => {
    setDeleteConfirmation({
      index: mappingIndex,
      id: mappingId,
      name: mappingName
    });
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      // Close the expanded view if this mapping is currently expanded
      if (expandedMappings.has(deleteConfirmation.id)) {
        const newExpanded = new Set(expandedMappings);
        newExpanded.delete(deleteConfirmation.id);
        setExpandedMappings(newExpanded);
      }
      
      // Call the parent's delete handler
      if (onDeleteMapping) {
        onDeleteMapping(deleteConfirmation.index, deleteConfirmation.id);
      }
      
      setDeleteConfirmation(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString();

  const renderFormattedView = () => (
    <div className="space-y-4 overflow-y-auto max-h-full p-4">
      {mappings.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No mappings created yet</p>
          <p className="text-sm mt-1">Create your first mapping to get started</p>
        </div>
      ) : (
        mappings.map((mapping, idx) => {
          const key = mapping.id ?? idx;
          const isOpen = expandedMappings.has(key);
          return (
            <div
              key={key}
              className="bg-gray-800 bg-opacity-70 rounded-lg border border-gray-700"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => toggleExpanded(key)}
              >
                <div className="flex items-center space-x-3">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  <div>
                    <h4 className="font-medium text-white">Mapping #{idx + 1}</h4>
                    <p className="text-sm text-gray-400">
                      {mapping.inputXpaths?.length || 0} → {mapping.targetXpaths?.length || 0} elements
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {mapping.createdAt ? formatDate(mapping.createdAt) : 'Unknown date'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(JSON.stringify(mapping, null, 2));
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copy mapping"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-gray-700 p-4">
                  <pre className="text-xs text-gray-200 overflow-x-auto">
                    {JSON.stringify(mapping, null, 2)}
                  </pre>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMapping(idx, key, `Mapping #${idx + 1}`);
                    }}
                    className="mt-2 flex items-center space-x-1 text-red-500 hover:text-red-400 text-sm transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderJsonView = () => (
    <div className="overflow-y-auto max-h-full p-4">
      <pre className="text-sm text-gray-200 whitespace-pre-wrap">
        {JSON.stringify(mappings, null, 2)}
      </pre>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark semi-transparent overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      {/* Modal window */}
      <div className={`relative w-full max-w-3xl h-[80%] bg-gray-900 bg-opacity-90 rounded-lg shadow-xl flex flex-col ${deleteConfirmation ? 'blur-sm' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            Global Mappings Viewer
          </h3>
          <div className="flex items-center space-x-4">
            {/* view toggle */}
            <button
              onClick={() =>
                setViewMode((v) => (v === 'formatted' ? 'json' : 'formatted'))
              }
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Toggle view"
            >
              {viewMode === 'formatted' ? (
                <Eye className="h-5 w-5 text-gray-300" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-300" />
              )}
            </button>

            {/* download all */}
            <button
              onClick={downloadMappings}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Download all mappings"
            >
              <Download className="h-5 w-5 text-gray-300" />
            </button>

            {/* copy all */}
            <button
              onClick={() => copyToClipboard(JSON.stringify(mappings, null, 2))}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Copy all mappings"
            >
              <Copy className="h-5 w-5 text-gray-300" />
            </button>

            {/* close */}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Close viewer"
            >
              <X className="h-5 w-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'formatted'
            ? renderFormattedView()
            : renderJsonView()}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Delete Mapping</h4>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-medium text-white">{deleteConfirmation.name}</span>?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalMappingViewer;