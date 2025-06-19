import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, FolderOpen, Folder } from 'lucide-react';

const TreeNode = ({ element, level = 0, isRoot = false, selectedElements = [], onElementSelect, type }) => {
  const [isExpanded, setIsExpanded] = useState(isRoot);
  
  const hasChildren = element.elements && element.elements.length > 0;
  const indent = level * 20;
  const isSelected = selectedElements.some(el => el.id === element.id);

  const toggleExpanded = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    if (onElementSelect) {
      onElementSelect(element);
    }
  };

  const getDataTypeColor = (dataType) => {
    switch (dataType?.toLowerCase()) {
      case 'string': return 'text-green-400';
      case 'int':
      case 'integer': return 'text-blue-400';
      case 'decimal':
      case 'double':
      case 'float': return 'text-yellow-400';
      case 'boolean': return 'text-purple-400';
      case 'date':
      case 'datetime': return 'text-pink-400';
      case 'complextype': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getIcon = () => {
    if (hasChildren) {
      return isExpanded ? (
        <FolderOpen className="h-4 w-4 text-yellow-500" />
      ) : (
        <Folder className="h-4 w-4 text-yellow-600" />
      );
    }
    return <FileText className="h-4 w-4 text-blue-400" />;
  };

  const renderConstraints = () => {
    const constraints = [];
    
    if (element.minOccurs !== null) constraints.push(`min: ${element.minOccurs}`);
    if (element.maxOccurs !== null) constraints.push(`max: ${element.maxOccurs}`);
    if (element.minLength !== null) constraints.push(`minLen: ${element.minLength}`);
    if (element.maxLength !== null) constraints.push(`maxLen: ${element.maxLength}`);
    if (element.pattern !== null) constraints.push(`pattern: ${element.pattern}`);
    if (element.minInclusive !== null) constraints.push(`≥ ${element.minInclusive}`);
    if (element.maxInclusive !== null) constraints.push(`≤ ${element.maxInclusive}`);
    if (element.minExclusive !== null) constraints.push(`> ${element.minExclusive}`);
    if (element.maxExclusive !== null) constraints.push(`< ${element.maxExclusive}`);
    if (element.fractionDigits !== null) constraints.push(`fracDigits: ${element.fractionDigits}`);
    if (element.totalDigits !== null) constraints.push(`totalDigits: ${element.totalDigits}`);
    if (element.isCurrency) constraints.push('currency');
    if (element.values && element.values.length > 0) {
      constraints.push(`enum: [${element.values.join(', ')}]`);
    }

    return constraints.length > 0 ? (
      <div className="text-xs text-gray-500 mt-1 ml-6">
        {constraints.join(' | ')}
      </div>
    ) : null;
  };

  return (
    <div>
      <div
        className={`
          flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-700/50 transition-colors
          ${isRoot ? 'bg-gray-700/30' : ''}
          ${isSelected ? 'bg-blue-600/30 border border-blue-500/50' : ''}
        `}
        style={{ paddingLeft: `${8 + indent}px` }}
        onClick={handleElementClick}
      >
        <div className="flex items-center min-w-0 flex-1">
          {/* Chevron for expandable nodes */}
          <div className="flex items-center justify-center w-4 h-4 mr-2">
            {hasChildren ? (
              <button onClick={toggleExpanded} className="hover:bg-gray-600 rounded p-0.5">
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                )}
              </button>
            ) : null}
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          )}

          {/* Icon */}
          <div className="mr-2">
            {getIcon()}
          </div>

          {/* Element name */}
          <span className={`font-medium truncate ${isRoot ? 'text-white' : 'text-gray-200'}`}>
            {element.name}
          </span>

          {/* Data type */}
          {element.dataType && (
            <span className={`ml-2 text-xs font-mono px-2 py-0.5 rounded bg-gray-800 ${getDataTypeColor(element.dataType)}`}>
              {element.dataType}
            </span>
          )}

          {/* XPath */}
          {element.xpath && (
            <span className="ml-2 text-xs text-gray-500 font-mono truncate">
              {element.xpath}
            </span>
          )}
        </div>
      </div>

      {/* Constraints */}
      {renderConstraints()}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {element.elements.map((childElement, index) => (
            <TreeNode
              key={childElement.id || `${element.id}-child-${index}`}
              element={childElement}
              level={level + 1}
              selectedElements={selectedElements}
              onElementSelect={onElementSelect}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;