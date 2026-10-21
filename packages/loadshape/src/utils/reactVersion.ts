import { version } from 'react';

const REF_AS_PROP_MAJOR_VERSION = 19;

export const IS_REACT_19: boolean = Number.parseInt(version, 10) >= REF_AS_PROP_MAJOR_VERSION;
