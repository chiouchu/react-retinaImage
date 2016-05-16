
import React from 'react';
import ReactDOM from 'react-dom';
import PureComponent from 'react-pure-render/component';

import RetinaImage from './RetinaImage';

class App extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            src: 'images/photo.jpg'
        };
    }

    componentDidMount() {
        document.getElementById('btn').addEventListener('click', () => {
            let path = this.state.src;
            path = (path === 'images/photo.jpg') ? 'images/photosmall.png' : 'images/photo.jpg';

            this.setState({
                src: path
            });
        });
    }

    render() {
        const path = this.state.src;

        return (
            <div>
                <h1 id="btn">Component:</h1>
                <RetinaImage src={ path } />
                <h1>LESS Mixin:</h1>
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
