import {mountInteractions} from './interactions.js';
import {enhanceSelect} from '../select.js';

document.querySelectorAll('.property-search select').forEach(select => enhanceSelect(select, {compact: true}));
mountInteractions();
