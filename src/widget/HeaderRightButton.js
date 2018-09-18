import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import {Button} from 'native-base'
const {FuncUtil} = require('@ys/vanilla')
const {debounceFunc} = FuncUtil

export default class HeaderRightButton extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const {onPress, color, title} = this.props
    return (
      <View style={{marginHorizontal: 10}}>
        <Button light small style={{paddingHorizontal: 8}} onPress={debounceFunc(onPress)}>
          <Text style={{color, fontWeight: 'bold'}}>{title}</Text>
        </Button>
      </View>
    )
  }
}

HeaderRightButton.defaultProps = {}

HeaderRightButton.propTypes = {
  onPress: PropTypes.func,
  color: PropTypes.string,
  title: PropTypes.string
}
