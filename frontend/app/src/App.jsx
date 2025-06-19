import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import SchemaTree from './components/SchemaTree';
import MappingCreator from './components/MappingCreator';
import GlobalMappingViewer from './components/GlobalMappingViewer';
import './App.css';

function App() {
  const [inputXsdFile, setInputXsdFile] = useState(null);
  const [targetXsdFile, setTargetXsdFile] = useState(null);
  const [inputSchema, setInputSchema] = useState(null);
  const [targetSchema, setTargetSchema] = useState(null);
  const [loading, setLoading] = useState({ input: false, target: false });
  
  // Mapping related state
  const [globalMappings, setGlobalMappings] = useState([]);
  const [selectedInputElements, setSelectedInputElements] = useState([]);
  const [selectedTargetElements, setSelectedTargetElements] = useState([]);
  const [showMappingCreator, setShowMappingCreator] = useState(false);
  const [showGlobalMappings, setShowGlobalMappings] = useState(false);

  // Dummy API call - replace with actual backend endpoint
  const processXsdFile = async (file, type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    
    try {
      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dummySchema = {
        namespace: `http://example.com/${type}`,
        SchemaElement: {
          id: `root-${type}`,
          name: `${type}Root`,
          dataType: "complexType",
          minOccurs: "1",
          maxOccurs: "1",
          minLength: null,
          maxLength: null,
          pattern: null,
          fractionDigits: null,
          totalDigits: null,
          minInclusive: null,
          maxInclusive: null,
          minExclusive: null,
          maxExclusive: null,
          values: null,
          isCurrency: false,
          xpath: `/${type}Root`,
          elements: [
            {
              id: `${type}-person`,
              name: "Person",
              dataType: "complexType",
              minOccurs: "0",
              maxOccurs: "unbounded",
              minLength: null,
              maxLength: null,
              pattern: null,
              fractionDigits: null,
              totalDigits: null,
              minInclusive: null,
              maxInclusive: null,
              minExclusive: null,
              maxExclusive: null,
              values: null,
              isCurrency: false,
              xpath: `/${type}Root/Person`,
              elements: [
                {
                  id: `${type}-firstname`,
                  name: "FirstName",
                  dataType: "string",
                  minOccurs: "1",
                  maxOccurs: "1",
                  minLength: "1",
                  maxLength: "50",
                  pattern: null,
                  fractionDigits: null,
                  totalDigits: null,
                  minInclusive: null,
                  maxInclusive: null,
                  minExclusive: null,
                  maxExclusive: null,
                  values: null,
                  isCurrency: false,
                  xpath: `/${type}Root/Person/FirstName`,
                  elements: []
                },
                {
                  id: `${type}-lastname`,
                  name: "LastName",
                  dataType: "string",
                  minOccurs: "1",
                  maxOccurs: "1",
                  minLength: "1",
                  maxLength: "50",
                  pattern: null,
                  fractionDigits: null,
                  totalDigits: null,
                  minInclusive: null,
                  maxInclusive: null,
                  minExclusive: null,
                  maxExclusive: null,
                  values: null,
                  isCurrency: false,
                  xpath: `/${type}Root/Person/LastName`,
                  elements: []
                },
                {
                  id: `${type}-age`,
                  name: "Age",
                  dataType: "int",
                  minOccurs: "0",
                  maxOccurs: "1",
                  minLength: null,
                  maxLength: null,
                  pattern: null,
                  fractionDigits: null,
                  totalDigits: null,
                  minInclusive: "0",
                  maxInclusive: "120",
                  minExclusive: null,
                  maxExclusive: null,
                  values: null,
                  isCurrency: false,
                  xpath: `/${type}Root/Person/Age`,
                  elements: []
                }
              ]
            },
            {
              id: `${type}-address`,
              name: "Address",
              dataType: "complexType",
              minOccurs: "0",
              maxOccurs: "1",
              minLength: null,
              maxLength: null,
              pattern: null,
              fractionDigits: null,
              totalDigits: null,
              minInclusive: null,
              maxInclusive: null,
              minExclusive: null,
              maxExclusive: null,
              values: null,
              isCurrency: false,
              xpath: `/${type}Root/Address`,
              elements: [
                {
                  id: `${type}-street`,
                  name: "Street",
                  dataType: "string",
                  minOccurs: "1",
                  maxOccurs: "1",
                  minLength: null,
                  maxLength: "100",
                  pattern: null,
                  fractionDigits: null,
                  totalDigits: null,
                  minInclusive: null,
                  maxInclusive: null,
                  minExclusive: null,
                  maxExclusive: null,
                  values: null,
                  isCurrency: false,
                  xpath: `/${type}Root/Address/Street`,
                  elements: []
                },
                {
                  id: `${type}-city`,
                  name: "City",
                  dataType: "string",
                  minOccurs: "1",
                  maxOccurs: "1",
                  minLength: null,
                  maxLength: "50",
                  pattern: null,
                  fractionDigits: null,
                  totalDigits: null,
                  minInclusive: null,
                  maxInclusive: null,
                  minExclusive: null,
                  maxExclusive: null,
                  values: null,
                  isCurrency: false,
                  xpath: `/${type}Root/Address/City`,
                  elements: []
                }
              ]
            }
          ]
        }
      };

      if (type === 'input') {
        setInputSchema(dummySchema);
      } else {
        setTargetSchema(dummySchema);
      }
    } catch (error) {
      console.error(`Error processing ${type} XSD:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleProcessInput = () => {
    if (inputXsdFile) {
      processXsdFile(inputXsdFile, 'input');
    }
  };

  const handleProcessTarget = () => {
    if (targetXsdFile) {
      processXsdFile(targetXsdFile, 'target');
    }
  };

  // Mapping functions
  const handleElementSelect = (element, type) => {
    if (type === 'input') {
      setSelectedInputElements(prev => {
        const exists = prev.find(el => el.id === element.id);
        if (exists) {
          return prev.filter(el => el.id !== element.id);
        }
        return [...prev, element];
      });
    } else {
      setSelectedTargetElements(prev => {
        const exists = prev.find(el => el.id === element.id);
        if (exists) {
          return prev.filter(el => el.id !== element.id);
        }
        return [...prev, element];
      });
    }
  };

  const addMapping = (mapping) => {
    setGlobalMappings(prev => [...prev, { ...mapping, id: Date.now() }]);
    setSelectedInputElements([]);
    setSelectedTargetElements([]);
  };

  // Delete mapping function
  const handleDeleteMapping = (mappingIndex, mappingId) => {
    setGlobalMappings(prevMappings => {
      const newMappings = [...prevMappings];
      newMappings.splice(mappingIndex, 1); // Remove mapping at the specified index
      return newMappings;
    });
  };

  const clearSelections = () => {
    setSelectedInputElements([]);
    setSelectedTargetElements([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">XSD Schema Mapper</h1>
            <p className="text-gray-400 mt-1">Upload and visualize XSD schemas side by side</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowGlobalMappings(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Global Mappings ({globalMappings.length})
            </button>
            <button
              onClick={() => setShowMappingCreator(!showMappingCreator)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {showMappingCreator ? 'Hide Mapping Creator' : 'Create Mapping'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Input XSD Panel */}
        <div className="flex-1 border-r border-gray-700 flex flex-col">
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
            <h2 className="text-lg font-semibold text-blue-400">Input XSD</h2>
          </div>
          
          <div className="p-4 border-b border-gray-700">
            <FileUpload
              onFileSelect={setInputXsdFile}
              selectedFile={inputXsdFile}
              accept=".xsd"
              label="Upload Input XSD"
            />
            {inputXsdFile && (
              <button
                onClick={handleProcessInput}
                disabled={loading.input}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading.input ? 'Processing...' : 'Process Input XSD'}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto p-4">
            {inputSchema ? (
              <SchemaTree 
                schema={inputSchema} 
                selectedElements={selectedInputElements}
                onElementSelect={(element) => handleElementSelect(element, 'input')}
                type="input"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Upload and process an XSD file to view its structure</p>
              </div>
            )}
          </div>
        </div>

        {/* Target XSD Panel */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
            <h2 className="text-lg font-semibold text-green-400">Target XSD</h2>
          </div>
          
          <div className="p-4 border-b border-gray-700">
            <FileUpload
              onFileSelect={setTargetXsdFile}
              selectedFile={targetXsdFile}
              accept=".xsd"
              label="Upload Target XSD"
            />
            {targetXsdFile && (
              <button
                onClick={handleProcessTarget}
                disabled={loading.target}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading.target ? 'Processing...' : 'Process Target XSD'}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto p-4">
            {targetSchema ? (
              <SchemaTree 
                schema={targetSchema} 
                selectedElements={selectedTargetElements}
                onElementSelect={(element) => handleElementSelect(element, 'target')}
                type="target"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Upload and process an XSD file to view its structure</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mapping Creator Sticky Window */}
      {showMappingCreator && (
        <MappingCreator
          inputElements={selectedInputElements}
          targetElements={selectedTargetElements}
          onAddMapping={addMapping}
          onClearSelections={clearSelections}
          onClose={() => setShowMappingCreator(false)}
        />
      )}

      {/* Global Mappings Viewer */}
      {showGlobalMappings && (
        <GlobalMappingViewer
          mappings={globalMappings}
          onClose={() => setShowGlobalMappings(false)}
          onDeleteMapping={handleDeleteMapping}
        />
      )}
    </div>
  );
}

export default App;