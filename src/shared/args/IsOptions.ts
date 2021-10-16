import { Schema } from 'ajv/dist/2019';
import ajv from './TypeBoxAjv';

export const isOptions = <T>(prospect: T | unknown, schema: string | Schema): prospect is T  => 
    ajv.validate(schema, prospect);
