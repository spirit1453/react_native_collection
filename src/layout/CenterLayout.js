import React, {Component} from 'react'
import {
  Text,
  View,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
const _ = require('lodash')

export default class CenterLayout extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    let {img, text, imgSize, textStyle} = this.props
    const defaultTextStyle = {fontSize: 18}
    textStyle = _.merge(defaultTextStyle, textStyle)
    return (
      <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-start', marginTop: 200}}>
        <Image source ={img} style={{width: imgSize, height: imgSize}} resizeMode='contain'/>
        <View style={{margin: 20}}>
          <Text style={textStyle}>
            {text}
          </Text>
        </View>
      </View>
    )
  }
}

CenterLayout.defaultProps = {
  imgSize: 120,
  textStyle: {}
}

CenterLayout.propTypes = {
  imgSize: PropTypes.number,
  textStyle: PropTypes.object,
  text: PropTypes.string,
  // todo: require('')
  img: PropTypes.any.required
}
