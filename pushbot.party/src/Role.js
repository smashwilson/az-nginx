import {Component} from 'react'
import PropTypes from 'prop-types'

export const UserPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired
  })).isRequired
})

export default class Role extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired
  }

  static contextTypes = {
    user: UserPropType
  }

  render () {
    const match = this.context.user.roles.some(role => role.name === this.props.name)
    if (!match) return null

    return this.props.children
  }
}
