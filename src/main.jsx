import {DraftPreview} from './content/preview.jsx';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { getLocale } from './locale.js';
import './styles.css';
import './catalog.css';
import './audit-fixes.css';
import './reference.css';

document.documentElement.lang = getLocale() === 'zh' ? 'zh-CN' : 'en';
const root = document.getElementById('root');
const page=/^\/(?:zh\/)?content-preview$/.test(window.location.pathname)?<DraftPreview/>:<App/>;
if (root.hasChildNodes()) hydrateRoot(root, page);
else createRoot(root).render(page);

import './editorial.css';
