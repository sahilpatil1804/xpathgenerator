// Type definitions for XSD Schema structure
// These correspond to the TypeScript interfaces mentioned in the requirements

/**
 * @typedef {Object} XsdSchema
 * @property {string} namespace - The XML namespace of the schema
 * @property {SchemaElement} SchemaElement - The root schema element
 */

/**
 * @typedef {Object} SchemaElement
 * @property {string} id - Unique identifier for the element
 * @property {string} name - Name of the element
 * @property {string|null} dataType - Data type of the element (e.g., 'string', 'int', 'complexType')
 * @property {string|null} minOccurs - Minimum number of occurrences
 * @property {string|null} maxOccurs - Maximum number of occurrences
 * @property {string|null} minLength - Minimum length constraint
 * @property {string|null} maxLength - Maximum length constraint
 * @property {string|null} pattern - Regular expression pattern constraint
 * @property {string|null} fractionDigits - Number of fraction digits for decimal types
 * @property {string|null} totalDigits - Total number of digits for decimal types
 * @property {string|null} minInclusive - Minimum inclusive value
 * @property {string|null} maxInclusive - Maximum inclusive value
 * @property {string|null} minExclusive - Minimum exclusive value
 * @property {string|null} maxExclusive - Maximum exclusive value
 * @property {string[]|null} values - Enumerated values
 * @property {boolean|null} isCurrency - Whether the element represents currency
 * @property {string|null} xpath - XPath expression for the element
 * @property {SchemaElement[]} elements - Child elements
 */

// Export dummy data generator for testing
export const generateDummySchema = (type) => {
  return {
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
      elements: []
    }
  };
};