import { runSuite } from '../../test-utils/suite';
import suite from '../../e2e/suites/visually-hidden.mjs';
import { App } from '../src/App';
import '../src/index.css';

runSuite(App, 'visually-hidden', suite);
