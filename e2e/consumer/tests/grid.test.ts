import { runSuite } from '../../../test-utils/suite';
import suite from '../../suites/grid.mjs';
import { App } from '../src/App';
import '../src/index.css';

runSuite(App, 'grid', suite);
