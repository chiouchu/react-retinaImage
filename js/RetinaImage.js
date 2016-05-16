
import React, { Component, PropTypes } from 'react';
import isRetina from 'is-retina';
import imageExists from 'image-exists';
import path from 'path';

class RetinaImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            src: props.src,
            width: 'auto',
            height: 'auto',
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
                width: 'auto',
                height: 'auto',
                imgLoaded: false,
                retinaImgExists: false,
                retinaCheckComplete: false
            });
        }
    }

    render() {
        return (<img
            ref="img"
            { ...this.props }
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
                            Object.assign(newState, { src: imgSrc });
                            this.setImageSize();
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

        Object.assign(newState, { imgLoaded: true });

        // If the retina image check has already finished, set the 2x path.
        if (retinaImgExists || !checkIfRetinaImgExists) {
            Object.assign(newState, { src: imgSrc });
        }

        this.setState(newState);
        this.setImageSize();
    }

    setImageSize() {
        const { forceOriginalDimensions, src } = this.props;

        if (forceOriginalDimensions) {
            const originImg = new Image;
            originImg.onload = () => {
                this.setState({
                    width: originImg.width,
                    height: originImg.height
                });
            };
            originImg.src = src;
        }
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
    alt: PropTypes.string,
    checkIfRetinaImgExists: PropTypes.bool,
    forceOriginalDimensions: PropTypes.bool,
    retinaImageSuffix: PropTypes.string
};

RetinaImage.defaultProps = {
    alt: '',
    checkIfRetinaImgExists: true,
    forceOriginalDimensions: true,
    retinaImageSuffix: '@2x'
};

export default RetinaImage;
