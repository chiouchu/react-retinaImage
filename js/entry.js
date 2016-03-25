
import React from 'react';
import ReactDOM from 'react-dom';
import PureComponent from 'react-pure-render/component';

import RetinaImage from './RetinaImage';

class App extends PureComponent {
    render() {
        return (
            <div>
                <h1>RetinaImage.js for img tag</h1>
                <RetinaImage src="images/photo.jpg" />
                <h1>LESS for backgraound images</h1>
                <div className="bgRetina"></div>
            </div>
        );
    }
}

function initApp() {
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
}

initApp();
