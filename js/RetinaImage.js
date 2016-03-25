
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
            { ...this.props }
            { ...this.state }
            src={ this.state.src }
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
                    if (exists) {
                        if (imgLoaded) {
                            this.setState({ src: imgSrc });
                        } else {
                            this.setState({ retinaImgExists: true });
                        }
                    }
                    this.setState({ retinaCheckComplete: true });
                });
            } else {
                this.setState({ src: imgSrc });
            }
        } else {
            this.setState({ retinaCheckComplete: true });
        }
    }

    checkLoaded() {
        const el = this.refs.img;
        if (!el.complete) {
            return false;
        }
        if (el.naturalWidth === 0) {
            return false;
        }
        this.handleOnLoad();
    }

    handleOnLoad() {
        const { forceOriginalDimensions, checkIfRetinaImgExists } = this.props;
        const { retinaImgExists } = this.state;
        const imgSrc = this.getRetinaPath();
        const imgRef = this.refs.img;

        if (forceOriginalDimensions) {
            this.setState({
                width: imgRef.clientWidth,
                height: imgRef.clientHeight
            });
        }
        this.setState({ imgLoaded: true });

        if (retinaImgExists || !checkIfRetinaImgExists) {
            this.setState({ src: imgSrc });
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
