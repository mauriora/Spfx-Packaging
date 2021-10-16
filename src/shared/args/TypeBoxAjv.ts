/**
 * Returns an Ajv instance setting defaults, with heapz added formats and added keywords 'kind' and 'modifier'
 * Slightly adjusted copy of
 * @link https://github.com/sinclairzx81/typebox#Validation
 */
//--------------------------------------------------------------------------------------------
//
// Import the 2019 compliant validator from AJV
//
//--------------------------------------------------------------------------------------------

import addFormats from 'ajv-formats'
import Ajv        from 'ajv/dist/2019'

//--------------------------------------------------------------------------------------------
//
// Setup AJV validator with the following options and formats
//
//--------------------------------------------------------------------------------------------

const ajv = addFormats(new Ajv({ useDefaults: true,  }), [
    'date-time', 
    'time', 
    'date', 
    'email',  
    'hostname', 
    'ipv4', 
    'ipv6', 
    'uri', 
    'uri-reference', 
    'uuid',
    'uri-template', 
    'json-pointer', 
    'relative-json-pointer', 
    'regex'
]).addKeyword('kind')
  .addKeyword('modifier')

  export default ajv;