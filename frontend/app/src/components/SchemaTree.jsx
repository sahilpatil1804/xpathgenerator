import React from 'react';
import TreeNode from './TreeNode';

const SchemaTree = ({ schema, selectedElements = [], onElementSelect, type }) => {
  if (!schema) {
    return (
      <div className="text-gray-500 text-center py-8">
        No schema data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Schema Information</h3>
        <div className="text-xs text-gray-400 space-y-1">
          <div>
            <span className="font-medium">Namespace:</span> {schema.namespace}
          </div>
        </div>
      </div>
      
      <div className="border border-gray-700 rounded-lg bg-gray-800/50">
        <div className="p-2 border-b border-gray-700 bg-gray-800 rounded-t-lg">
          <h4 className="text-sm font-semibold text-gray-200">Schema Elements</h4>
        </div>
        <div className="p-2">
          <TreeNode 
            element={schema.SchemaElement} 
            level={0}
            isRoot={true}
            selectedElements={selectedElements}
            onElementSelect={onElementSelect}
            type={type}
          />
        </div>
      </div>
    </div>
  );
};

export default SchemaTree;