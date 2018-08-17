import React from 'react'
import { FirestoreCollection } from 'react-firestore'

import Error from '../Error'
import createSubscription from '../../actions/createSubscription'
import updateSubscription from '../../actions/updateSubscription'
import deleteSubscription from '../../actions/deleteSubscription'

class Subscription extends React.Component {

  componentDidMount() {
    // https://stripe.com/docs/checkout
    this._handler = window.StripeCheckout.configure({
      key: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
      locale: 'auto',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      name: 'Firefly',
      description: 'Subscribe to Firefly',
      email: this.props.auth.email,
      allowRememberMe: false,
      amount: 39 * 100, // in cents
    })
  }

  makeNewPayment = () => {
    this._handler.open({
      token: createSubscription,
    })
  }

  updatePaymentMethod = subscription_id => {
    this._handler.open({
      token: token => updateSubscription(subscription_id, token),
    })
  }

  componentWillUnmount() {
    this._handler.close()
  }

  render() {
    return <FirestoreCollection
      path="subscriptions"
      filter={['user', '==', this.props.auth.uid]}
    >
      { ({error, isLoading, data}) => {
                
        if (error || data.length === 0) {
          return <Error error={error} />
        }

        if (isLoading) {
          return 'loading...'
        }

        const subscription = data[0]

        if (!subscription) {
          return <div>
            Subscribe to Firefly to get paid features
            <br/>
            <button onClick={this.makeNewPayment}>Subscribe now</button>
          </div>
        }

        if (subscription.stripe_subscription_error) {
          return <span style={{color: 'red'}}>Whoops&mdash;there was an error updating your subscription. Sorry about that!</span>
        }

        if (subscription.temp_stripe_payment_token_id) {
          return 'Updating your subscription...'
        }

        return <div>
          You are subscribed!
          <br/>
          Status: {subscription.stripe_subscription_status}
          <br/>
          <button onClick={() => this.updatePaymentMethod(subscription.id)}>Update payment method</button>
          <div onClick={() => {
            if (window.confirm(`Are you sure you want to cancel your subscription? You won't have access to paid Firefly features.`)) {
              deleteSubscription(subscription)
            }
          }}>Cancel subscription</div>
        </div>

      }}
    </FirestoreCollection>
  }
}

export default Subscription