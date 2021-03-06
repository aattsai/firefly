// the main routes of our app are defined here using react-router
// https://reacttraining.com/react-router/web/example/basic
//
// includes a simple route change animation
// https://codesandbox.io/embed/YE6l8EmR9

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import PostList from './posts/PostList'
import Post from './posts/Post'
import PostEdit from './posts/PostEdit'
import PostNew from './posts/PostNew'
import Search from './search/Search'
import Account from './account/Account'
import Error from './misc/Error'
import {
  PageContainer,
} from '../styles/layout'

const Routes = () => (
  <Route render={ ({location}) => (
    <TransitionGroup key="transition-group" component={PageContainer}>
      <CSSTransition key={location.pathname} classNames="fade" timeout={1000} mountOnEnter={true} unmountOnExit={true}>
        <Switch location={location}>
          <Route exact path="/" component={PostList} />
          <Route path="/new" component={PostNew} />
          <Route path="/search" component={Search} />
          <Route path="/account" component={Account} />
          <Route path="/:slug/edit" component={PostEdit} />
          <Route path="/:slug" component={Post} />
          <Route component={Error} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  )} />
)

export default Routes
