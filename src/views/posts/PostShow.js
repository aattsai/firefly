import React from 'react'
import { Link } from 'react-router-dom'

import Auth from '../../models/Auth'
import Post from '../../models/Post'
import PostLiker from './components/PostLiker'
import Error from '../Error'
import Loading from '../Loading'

class PostShow extends React.Component {

  constructor(props) {
    super(props)
    this._get = this._get.bind(this)
    this.state = {
      loading: true,
      post: {},
      error: null,
    }
  }

  componentWillMount() {
    this._isMounted = true
    this._get()
    Post.on('change', this._get)
  }

  componentWillUpdate() {
    this._get()
  }

  componentWillUnmount() {
    this._isMounted = false
    Post.removeListener('change', this._get)
  }

  _get() {
    Post.getBySlug(this.props.match.params.post_slug).then( (post) => {
      if (this._isMounted) {
        this.setState({
          loading: false,
          post,
        })
      }
    }).catch( (err) => {
      if (this._isMounted) {
        this.setState({
          loading: false,
          error: err.message,
        })
      }
    })
  }

  render() {
    if (this.state.loading) {
      return(<Loading />)
    }
    if (this.state.error) {
      return (<Error message={this.state.error}/>)
    }
    if (!this.state.post.title) {
      return (<div>loading...</div>)
    } else {
      let editLink = null
      if (Auth.getLoggedInUser() && this.state.post.createdBy === Auth.getLoggedInUser().uid) {
        editLink = <Link to={'/posts/'+this.state.post.slug+'/edit'}>edit post</Link>
      }
      return (
        <div>
          <h1>{this.state.post.title}</h1>
          <PostLiker post={this.state.post} />
          <p>{this.state.post.content}</p>
          {editLink}
        </div>
      )
    }
  }
}

export default PostShow
