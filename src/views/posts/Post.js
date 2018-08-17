import React from 'react'
import { FirestoreCollection } from 'react-firestore'

import Error from '../Error'
import AuthProvider from '../../data/AuthProvider'
import LikeCount from '../postLikes/LikeCount'
import LikeButton from '../postLikes/LikeButton'
import {
  AppLink,
  Page,
} from '../../styles/global'

const Post = ({slug}) => (
  <Page>
    <FirestoreCollection
      path={'posts'}
      filter={['slug', '==', slug]}
    >
      { ({error, isLoading, data}) => {
        if (error || data.length === 0) {
          return <Error error={error} />
        }

        if (isLoading) {
          return 'loading...'
        }

        const post = data[0]

        return <div>
          <h1>{post.title}</h1>
          <LikeCount post={post} />
          <LikeButton post={post} />
          <p>{post.content}</p>
          <AuthProvider>
            {auth => (
              auth ? <AppLink to={`/${post.slug}/edit`}>Edit</AppLink> : null
            )}
          </AuthProvider>
        </div>
      }}
    </FirestoreCollection>
  </Page>
)

export default Post