import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Chartist from 'chartist'

Chartist.plugins = Chartist.plugins || {}
Chartist.plugins.ctHtmlLabels = function (options) {
  return function (chart) {
    chart.on('draw', function (context) {
      if (context.type === 'label') {
        context.element.empty()._node.innerHTML = context.text
      }
    })
  }
}

export default class Chart extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    options: PropTypes.object
  }

  render () {
    return <div className='ct-chart ct-golden-section' ref={c => { this.refElement = c }} />
  }

  componentDidMount () {
    const options = this.props.options || {}
    options.plugins = [Chartist.plugins.ctHtmlLabels()]

    this.chart = new Chartist.Bar(this.refElement, this.props.data, options)
  }

  componentWillUnmount () {
    //
  }
}
