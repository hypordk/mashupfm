var React = require('react')
var {PropTypes} = React;

var RefluxActions = require('../RefluxActions')

export default class VolumeControl extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      volume: localStorage.getItem('volume') || props.defaultVolume
    }

    this._mouseDownGrabber = this._mouseDownGrabber.bind(this)
    this._mouseMove = this._mouseMove.bind(this)
    this._mouseUp = this._mouseUp.bind(this)
  }

  _mouseDownGrabber(event) {
    document.addEventListener('mousemove', this._mouseMove)
    document.addEventListener('mouseup', this._mouseUp)
    document.body.classList.add('nohighlight')
    this._setVolume(event.pageX)
  }

  _mouseMove(event) {
    event.preventDefault()
    this._setVolume(event.pageX)
  }

  _setVolume(mouseX) {
    var container = this.refs.container.getBoundingClientRect()
    var volume = (mouseX - container.left) / container.width
    if (volume < 0) { volume = 0 }
    if (volume > 1) { volume = 1 }

    RefluxActions.changeVolume(Math.pow(volume, 2))
    this.setState({
      volume: volume
    })
    localStorage.setItem('volume', volume)
  }
  _mouseUp() {
    document.removeEventListener('mousemove', this._mouseMove)
    document.removeEventListener('mouseup', this._mouseUp)
    document.body.classList.remove('nohighlight')
  }
  render() {
    return (
      <div id='volume-container'
        ref="container"
        onMouseDown={this._mouseDownGrabber}
        >
        <div
          style={{
            width: this.state.volume * 100 + '%'
          }}
          id='volume-bar'
          ref='volumeBar'>
          <div id='volume-grabber'></div>
        </div>
      </div>
    )
  }
}
VolumeControl.defaultProps = {
  volume: 1,
}
VolumeControl.propTypes = {
  volume: PropTypes.number,
}
