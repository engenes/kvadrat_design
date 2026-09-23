import {mountCompany} from './company.js';
import {mountInteractions} from './interactions.js';
import {enhanceSelect} from '../select.js';
import {mountPromotions} from './promotions.js';

document.querySelectorAll('.property-search select').forEach(select => enhanceSelect(select, {compact: true}));
mountInteractions();
mountPromotions();

mountCompany();
