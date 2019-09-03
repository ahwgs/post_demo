import React from 'react';
import ReactDOM from 'react-dom';
import Parent from './Parent';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Parent />, document.getElementById('root'));

serviceWorker.unregister();
