import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, ArrowRight, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const MappingCreator = ({ inputElements, targetElements, onAddMapping, onClearSelections, onClose }) => {
  const [selectedTransforms, setSelectedTransforms] = useState([]);
  const [description, setDescription] = useState('');
  const [width, setWidth] = useState(400); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const resizeRef = useRef(null);
  const containerRef = useRef(null);

  const availableTransforms = [
    { id: 'capitalize', name: 'Capitalize', description: 'Convert to uppercase' },
    { id: 'lowercase', name: 'Lowercase', description: 'Convert to lowercase' },
    { id: 'trim', name: 'Trim', description: 'Remove leading/trailing whitespace' },
    { id: 'addPrefix', name: 'Add Prefix', description: 'Add text at beginning' },
    { id: 'addSuffix', name: 'Add Suffix', description: 'Add text at end' },
    { id: 'reverse', name: 'Reverse', description: 'Reverse the string' },
    { id: 'replace', name: 'Replace', description: 'Replace text patterns' },
    { id: 'substring', name: 'Substring', description: 'Extract portion of text' },
    { id: 'concatenate', name: 'Concatenate', description: 'Join multiple values' },
    { id: 'split', name: 'Split', description: 'Split value into parts' },
    { id: 'formatDate', name: 'Format Date', description: 'Change date format' },
    { id: 'formatNumber', name: 'Format Number', description: 'Change number format' },
    { id: 'default', name: 'Default Value', description: 'Set default if empty' },
    { id: 'multiply', name: 'Multiply', description: 'Multiply numeric value' },
    { id: 'divide', name: 'Divide', description: 'Divide numeric value' }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const mouseX = e.clientX;
      const windowWidth = window.innerWidth;
      const newWidth = windowWidth - mouseX;
      
      // Set minimum and maximum width constraints
      const minWidth = 300;
      const maxWidth = windowWidth * 0.6;
      
      setWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleTransformToggle = (transformId) => {
    setSelectedTransforms(prev => {
      if (prev.includes(transformId)) {
        return prev.filter(id => id !== transformId);
      }
      return [...prev, transformId];
    });
  };

  const handleAddMapping = () => {
    if (inputElements.length === 0 || targetElements.length === 0) {
      alert('Please select at least one input and one target element');
      return;
    }

    const mapping = {
      inputXpaths: inputElements.map(el => el.xpath),
      targetXpaths: targetElements.map(el => el.xpath),
      transforms: selectedTransforms,
      description: description.trim() || 'No description provided',
      createdAt: new Date().toISOString()
    };

    onAddMapping(mapping);
    setSelectedTransforms([]);
    setDescription('');
  };

  const handleClear = () => {
    onClearSelections();
    setSelectedTransforms([]);
    setDescription('');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 right-0 h-full bg-gray-800 border-l border-gray-700 shadow-2xl z-50 flex"
      style={{ width: isCollapsed ? '48px' : `${width}px` }}
    >
      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          ref={resizeRef}
          onMouseDown={handleResizeStart}
          className="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 transition-colors bg-gray-600"
          title="Drag to resize"
        />
      )}
      
      {/* Collapse/Expand Button */}
      <div className="absolute top-4 left-2 z-10">
        <button
          onClick={toggleCollapse}
          className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded transition-colors"
          title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-800">
          <div className="transform -rotate-90 whitespace-nowrap text-sm text-gray-400 mb-4">
            Mapping Creator
          </div>
          <div className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap">
            {inputElements.length + targetElements.length} selected
          </div>
        </div>
      )}

      {/* Expanded Content */}
      {!isCollapsed && (
        <div className="flex-1 pl-4 pr-4 py-4 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 mt-8">
            <h3 className="text-lg font-semibold text-white">Create New Mapping</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Selected Elements Display */}
          <div className="space-y-4 mb-6">
            {/* Input Elements */}
            <div className="bg-gray-900 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-400 mb-2">
                Input Elements ({inputElements.length})
              </h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {inputElements.length === 0 ? (
                  <p className="text-gray-500 text-xs">No input elements selected</p>
                ) : (
                  inputElements.map((element, index) => (
                    <div key={element.id} className="text-xs text-gray-300 font-mono bg-gray-800 px-2 py-1 rounded">
                      {element.name} ({element.dataType})
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Target Elements */}
            <div className="bg-gray-900 rounded-lg p-3">
              <h4 className="text-sm font-medium text-green-400 mb-2">
                Target Elements ({targetElements.length})
              </h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {targetElements.length === 0 ? (
                  <p className="text-gray-500 text-xs">No target elements selected</p>
                ) : (
                  targetElements.map((element, index) => (
                    <div key={element.id} className="text-xs text-gray-300 font-mono bg-gray-800 px-2 py-1 rounded">
                      {element.name} ({element.dataType})
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Transforms Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-white mb-3">Select Transformations</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableTransforms.map((transform) => (
                <label
                  key={transform.id}
                  className="flex items-start space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors bg-gray-900"
                >
                  <input
                    type="checkbox"
                    checked={selectedTransforms.includes(transform.id)}
                    onChange={() => handleTransformToggle(transform.id)}
                    className="mt-0.5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-white block">{transform.name}</span>
                    <p className="text-xs text-gray-400 mt-1">{transform.description}</p>
                  </div>
                </label>
              ))}
            </div>
            
            {selectedTransforms.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {selectedTransforms.map(transformId => {
                  const transform = availableTransforms.find(t => t.id === transformId);
                  return (
                    <span
                      key={transformId}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600 text-white"
                    >
                      {transform?.name}
                      <button
                        onClick={() => handleTransformToggle(transformId)}
                        className="ml-1 hover:text-gray-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this mapping or any custom transformations..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddMapping}
              disabled={inputElements.length === 0 || targetElements.length === 0}
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Mapping</span>
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={handleClear}
                className="flex items-center justify-center space-x-1 flex-1 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MappingCreator;