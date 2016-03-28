
import React, { Component, PropTypes } from 'react';
import isRetina from 'is-retina';
import imageExists from 'image-exists';
import path from 'path';

class RetinaImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            src: props.src,
            imgLoaded: false,
            retinaImgExists: false,
            retinaCheckComplete: false
        };
    }

    componentDidMount() {
        this.checkForRetina();
        this.checkLoaded();
    }

    componentDidUpdate() {
        this.checkForRetina();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.src !== nextProps.src) {
            this.setState({
                src: nextProps.src,
                width: 0,
                height: 0,
                imgLoaded: false,
                retinaImgExists: false,
                retinaCheckComplete: false
            });
        }
    }

    render() {
        return (<img
            ref="img"
            src={ this.state.src }
            width={ this.state.width }
            height={ this.state.height }
            onLoad={ () => this.handleOnLoad() }
        />);
    }

    checkForRetina() {
        const { retinaCheckComplete, imgLoaded } = this.state;
        const { checkIfRetinaImgExists } = this.props;
        const imgSrc = this.getRetinaPath();

        if (retinaCheckComplete) return;
        if (isRetina()) {
            if (checkIfRetinaImgExists) {
                imageExists(imgSrc, (exists) => {
                    const newState = { retinaCheckComplete: true };
                    if (exists) {
                        if (!imgLoaded) {
                            Object.assign(newState, this.setImageSize(), { src: imgSrc });
                        } else {
                            Object.assign(newState, { retinaImgExists: true });
                        }
                    }
                    this.setState(newState);
                });
            } else {
                this.setState({ src: imgSrc });
            }
            this.setState({ retinaCheckComplete: true });
        }
    }

    checkLoaded() {
        const el = this.refs.img;
        if (!el.complete || el.naturalWidth === 0) {
            return false;
        }
        this.handleOnLoad();
    }

    handleOnLoad() {
        const { checkIfRetinaImgExists } = this.props;
        const { retinaImgExists } = this.state;
        const imgSrc = this.getRetinaPath();
        const newState = {};

        Object.assign(newState, this.setImageSize(), { imgLoaded: true });

        // If the retina image check has already finished, set the 2x path.
        if (retinaImgExists || !checkIfRetinaImgExists) {
            Object.assign(newState, { src: imgSrc });
        }

        this.setState(newState);
    }

    setImageSize() {
        const { forceOriginalDimensions } = this.props;
        const imgRef = this.refs.img;

        if (forceOriginalDimensions) {
            return ({
                width: imgRef.clientWidth,
                height: imgRef.clientHeight
            });
        }
        return {};
    }

    getRetinaPath() {
        const { src, retinaImageSuffix } = this.props;
        let basename = path.basename(src, path.extname(src));
        basename = basename + retinaImageSuffix + path.extname(src);
        const result = src.replace(path.basename(src), basename);

        return result;
    }
}

RetinaImage.propTypes = {
    src: PropTypes.string.isRequired,
    checkIfRetinaImgExists: PropTypes.bool,
    forceOriginalDimensions: PropTypes.bool,
    retinaImageSuffix: PropTypes.string
};

RetinaImage.defaultProps = {
    checkIfRetinaImgExists: true,
    forceOriginalDimensions: true,
    retinaImageSuffix: '@2x'
};

export default RetinaImage;
